import os
import json
import math
import google.generativeai as genai
from db import get_db_connection

def configure_genai(api_key=None):
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is not configured. Please set it in your environment or Settings panel.")
    genai.configure(api_key=key)

def get_embedding(text, api_key=None, is_query=False):
    configure_genai(api_key)
    task_type = "retrieval_query" if is_query else "retrieval_document"
    
    # Clean text to prevent empty/whitespace errors
    cleaned_text = text.strip()
    if not cleaned_text:
        # Return fallback zeros vector if text is empty (embedding length is 3072)
        return [0.0] * 3072

    try:
        response = genai.embed_content(
            model="models/gemini-embedding-001",
            content=cleaned_text,
            task_type=task_type
        )
        # Handle dict-like response or direct attribute response
        if isinstance(response, dict) and 'embedding' in response:
            return response['embedding']
        elif hasattr(response, 'embedding'):
            return response.embedding
        elif isinstance(response, dict) and 'embedding' in response.get('embeddings', [{}])[0]:
            return response['embeddings'][0]['embedding']
        else:
            # Fallback format checking
            return response.get('embedding', [0.0] * 3072)
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # Try legacy model name fallback
        try:
            response = genai.embed_content(
                model="models/gemini-embedding-2",
                content=cleaned_text,
                task_type=task_type
            )
            if isinstance(response, dict) and 'embedding' in response:
                return response['embedding']
            elif hasattr(response, 'embedding'):
                return response.embedding
            else:
                return response.get('embedding', [0.0] * 3072)
        except Exception as e2:
            print(f"Fallback embedding failed: {e2}")
            raise e

def cosine_similarity(v1, v2):
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    if not norm_v1 or not norm_v2:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

def index_chunks(doc_id, chunks, api_key=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    print(f"DEBUG: Starting index_chunks for doc_id {doc_id}. Chunks created: {len(chunks)}")
    try:
        for idx, text in enumerate(chunks):
            # 1. Store chunk text
            cursor.execute(
                "INSERT INTO chunks (doc_id, chunk_index, text_content) VALUES (?, ?, ?)",
                (doc_id, idx, text)
            )
            chunk_id = cursor.lastrowid
            
            # 2. Get embedding
            vector = get_embedding(text, api_key=api_key, is_query=False)
            vector_json = json.dumps(vector)
            
            # 3. Store embedding
            cursor.execute(
                "INSERT INTO embeddings (chunk_id, embedding_vector) VALUES (?, ?)",
                (chunk_id, vector_json)
            )
            print(f"DEBUG: Embedding generated and vector stored for chunk {idx+1}/{len(chunks)} (chunk_id: {chunk_id})")
        
        conn.commit()
        print(f"DEBUG: Upload Success - All {len(chunks)} vectors stored in database for doc_id {doc_id}.")
    except Exception as e:
        conn.rollback()
        print(f"DEBUG: Ingestion failed, SQLite transaction rolled back: {e}")
        raise e
    finally:
        conn.close()

def query_relevant_chunks(query_text, api_key=None, top_k=3):
    try:
        query_emb = get_embedding(query_text, api_key=api_key, is_query=True)
    except Exception as e:
        print(f"DEBUG: Vector search embedding error: {e}")
        return []

    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT 
            c.id as chunk_id, 
            c.chunk_index,
            c.text_content, 
            d.name as doc_name,
            e.embedding_vector
        FROM chunks c
        JOIN documents d ON c.doc_id = d.id
        JOIN embeddings e ON c.id = e.chunk_id
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        return []
        
    scored_chunks = []
    for row in rows:
        try:
            row_emb = json.loads(row['embedding_vector'])
            score = cosine_similarity(query_emb, row_emb)
            scored_chunks.append({
                "chunk_id": row['chunk_id'],
                "chunk_index": row['chunk_index'],
                "doc_name": row['doc_name'],
                "text_snippet": row['text_content'],
                "score": score
            })
        except Exception as e:
            print(f"DEBUG: Error calculating similarity for chunk {row['chunk_id']}: {e}")
            continue
            
    # Sort by similarity score descending
    scored_chunks.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top K matches
    return scored_chunks[:top_k]
