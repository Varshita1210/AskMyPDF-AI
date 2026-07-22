import os
import time
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from db import init_db, get_db_connection
from document_processor import process_document
from vector_store import index_chunks, query_relevant_chunks, configure_genai
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend development
CORS(app)

# Ensure database is initialized
init_db()

# Create folder for temporary upload storage
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp_uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/documents', methods=['GET'])
def get_documents():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, filename, upload_date, file_type, size, page_count, chunk_count FROM documents ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    
    docs = [dict(row) for row in rows]
    return jsonify(docs)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    api_key = request.headers.get('x-gemini-key')
    
    # Save file temporarily
    temp_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(temp_path)
        file_size = os.path.getsize(temp_path)
        file_ext = file.filename.split('.')[-1].lower()
        
        # 1. Parse and chunk document
        chunks, page_count = process_document(temp_path, file.filename)
        
        if not chunks:
            return jsonify({"error": "No text content could be extracted from this document."}), 400
            
        # 2. Insert into sqlite
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO documents (name, filename, upload_date, file_type, size, page_count, chunk_count) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (file.filename, file.filename, datetime.now().strftime("%Y-%m-%d"), file_ext, file_size, page_count, len(chunks))
        )
        doc_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # 3. Generate embeddings and index chunks
        try:
            index_chunks(doc_id, chunks, api_key=api_key)
        except Exception as embed_err:
            print(f"DEBUG: Indexing chunks failed. Deleting orphan document ID {doc_id}. Error: {embed_err}")
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
            conn.commit()
            conn.close()
            raise embed_err
            
        print(f"DEBUG: Upload Success - Document {file.filename} processed successfully (doc_id: {doc_id}, chunks: {len(chunks)}).")
        return jsonify({
            "message": "File processed and indexed successfully",
            "doc_id": doc_id,
            "chunks_count": len(chunks)
        })
        
    except Exception as e:
        print(f"Error during upload processing: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify if document exists
    cursor.execute("SELECT id FROM documents WHERE id = ?", (doc_id,))
    doc = cursor.fetchone()
    if not doc:
        conn.close()
        return jsonify({"error": "Document not found"}), 404
        
    try:
        # Enable foreign key cascade manually in SQLite connection
        cursor.execute("PRAGMA foreign_keys = ON")
        cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
        conn.commit()
        return jsonify({"message": "Document and associated vectors deleted successfully"})
    except Exception as e:
        print(f"Error deleting document {doc_id}: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    query = data.get('query', '')
    history = data.get('history', [])
    
    if not query:
        return jsonify({"error": "Query cannot be empty"}), 400
        
    api_key = request.headers.get('x-gemini-key')
    start_time = time.time()
    
    # 1. Retrieve matching chunks
    relevant_chunks = query_relevant_chunks(query, api_key=api_key, top_k=3)
    print(f"DEBUG: Retrieved Chunks Count: {len(relevant_chunks)}")
    for i, c in enumerate(relevant_chunks):
        print(f"  - Chunk {i+1} (Doc: {c['doc_name']}, Index: {c['chunk_index']}, Score: {c['score']:.4f})")
    
    # Check if there are any documents or chunks in database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM documents")
    docs_db_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM chunks")
    chunks_db_count = cursor.fetchone()[0]
    conn.close()
    
    # 2. Build RAG prompt
    if docs_db_count == 0 or chunks_db_count == 0:
        # Fallback if no files have been uploaded/matched
        context = "No technical documentation has been uploaded yet. Please upload documentation to start the RAG chat."
        citations = []
        avg_retrieval_score = 0.0
        print("DEBUG: Empty database state detected. Prompting document upload fallback.")
    else:
        context_blocks = []
        citations = []
        for c in relevant_chunks:
            context_blocks.append(f"Source Document: {c['doc_name']}\nChunk Index: {c['chunk_index']}\nContent Segment:\n{c['text_snippet']}\n")
            citations.append({
                "doc_name": c['doc_name'],
                "chunk_index": c['chunk_index'],
                "text_snippet": c['text_snippet'],
                "score": round(c['score'] * 100, 1)
            })
        context = "\n---\n".join(context_blocks)
        avg_retrieval_score = sum(c['score'] for c in relevant_chunks) / len(relevant_chunks) if relevant_chunks else 0.0        
    system_instruction = (
        "You are 'AskMyPDF AI', a premium AI platform for document intelligence. "
        "Your goal is to answer questions based on the technical context provided below.\n\n"
        "Rules:\n"
        "1. Answer the query relying ONLY on the provided context fragments.\n"
        "2. If the context does not contain sufficient details to answer, state clearly that the documentation does not contain enough info, and do not hallucinate.\n"
        "3. Provide precise, professional details, structured with markdown tables or lists if appropriate.\n"
        "4. Calculate an integer 'confidence' score between 50 and 100 representing how completely the context answers the user's question.\n"
        "5. Output your response as a valid JSON object matching this structure exactly:\n"
        "{\n"
        '  "answer": "Detailed answer formatted in markdown.",\n'
        '  "confidence": 95\n'
        "}\n"
    )
    
    prompt = f"Technical Context Documents:\n{context}\n\nUser Question: {query}"
    safe_prompt = prompt.encode('ascii', errors='ignore').decode('ascii')
    print(f"DEBUG: Gemini Prompt Generated:\n---\n{safe_prompt}\n---")
    
    try:
        configure_genai(api_key)
        
        # Use gemini-flash-latest for speed and reliability
        model = genai.GenerativeModel(
            model_name="models/gemini-flash-latest",
            system_instruction=system_instruction
        )
        
        # Request JSON mode to make parsing output 100% reliable
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        print(f"DEBUG: Raw Gemini Response: {response.text.strip()}")
        # Parse JSON output from Gemini
        response_json = json.loads(response.text)
        answer = response_json.get("answer", "Error parsing response.")
        confidence = response_json.get("confidence", int(max(50, min(100, avg_retrieval_score * 100))))
        
    except Exception as e:
        print(f"Gemini generation error: {e}")
        # Graceful fallback answer if API error occurs
        answer = f"Error communicating with Gemini model: {str(e)}"
        confidence = 50

    response_time = round(time.time() - start_time, 2)
    
    # 3. Log query to database for analytics
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO query_logs (query_text, answer_text, response_time, confidence_score, timestamp) VALUES (?, ?, ?, ?, ?)",
        (query, answer, response_time, confidence, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    )
    conn.commit()
    conn.close()
    
    return jsonify({
        "answer": answer,
        "confidence": confidence,
        "citations": citations,
        "response_time": response_time
    })

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Totals
    cursor.execute("SELECT COUNT(*) FROM documents")
    total_documents = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM query_logs")
    total_questions = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(response_time) FROM query_logs")
    avg_response_time = cursor.fetchone()[0] or 0.0
    
    cursor.execute("SELECT AVG(confidence_score) FROM query_logs")
    avg_confidence = cursor.fetchone()[0] or 95.0
    
    cursor.execute("SELECT COUNT(DISTINCT strftime('%Y-%m-%d %H', timestamp)) FROM query_logs")
    active_sessions = max(1, cursor.fetchone()[0] or 0)
    
    # 2. Daily/Monthly activity (past 30 days)
    cursor.execute('''
        SELECT strftime('%m-%d', timestamp) as date, COUNT(*) as count 
        from query_logs 
        group by date 
        order by date desc 
        limit 15
    ''')
    activity_rows = cursor.fetchall()
    monthly_activity = [{"date": r['date'], "count": r['count']} for r in reversed(activity_rows)]
    
    # 3. File type distribution
    cursor.execute("SELECT file_type, COUNT(*) as count FROM documents GROUP BY file_type")
    type_rows = cursor.fetchall()
    file_type_distribution = [{"name": r['file_type'].upper(), "value": r['count']} for r in type_rows]
    
    # 4. Citations count / Most cited documents (represented roughly through chunks in index)
    cursor.execute('''
        SELECT d.name, COUNT(c.id) as count
        FROM documents d
        JOIN chunks c ON d.id = c.doc_id
        GROUP BY d.name
        ORDER BY count DESC
        LIMIT 5
    ''')
    citation_rows = cursor.fetchall()
    most_cited_docs = [{"name": r['name'], "count": r['count']} for r in citation_rows]
    
    conn.close()
    
    return jsonify({
        "total_documents": total_documents,
        "total_questions": total_questions,
        "total_searches": total_questions,
        "active_sessions": active_sessions,
        "avg_response_time": round(avg_response_time, 2),
        "avg_confidence": round(avg_confidence, 1),
        "monthly_activity": monthly_activity,
        "most_cited_docs": most_cited_docs,
        "file_type_distribution": file_type_distribution
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
