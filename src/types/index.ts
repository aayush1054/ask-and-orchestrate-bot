
// Document types
export interface Document {
  id: string;
  name: string;
  content: string;
  chunks: string[];
  dateAdded: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  text: string;
  index: number;
  embedding?: number[];
}

// Vector types
export interface EmbeddedChunk {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
}

export interface VectorSearchResult {
  id: string;
  text: string;
  source: string;
  score: number;
}

// Tool types
export type ToolType = 'rag' | 'calculator' | 'dictionary';

// Agent response types
export interface AgentResponse {
  tool: ToolType;
  answer: string;
  contexts?: VectorSearchResult[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
