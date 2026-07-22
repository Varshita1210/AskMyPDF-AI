export interface Citation {
  doc_name: string;
  text_snippet: string;
  score?: number;
  chunk_index?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidenceScore?: number;
  citations?: Citation[];
  timestamp: string;
}

export interface DocumentInfo {
  id: number;
  name: string;
  filename: string;
  upload_date: string;
  file_type: string;
  size: number;
  page_count: number;
  chunk_count: number;
  summary?: string;
}

export interface AnalyticsSummary {
  total_documents: number;
  total_questions: number;
  avg_response_time: number;
  avg_confidence: number;
  monthly_activity: { date: string; count: number }[];
  most_cited_docs: { name: string; count: number }[];
  file_type_distribution: { name: string; value: number }[];
}

export interface ActivityFeedItem {
  id: string;
  type: 'upload' | 'query' | 'delete' | 'system';
  message: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}
