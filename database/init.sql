-- SmartDocRAG Database Schema for Neon.tech
-- Execute this script in Neon SQL Editor after creating the database

-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chunks table with vector embeddings
-- Using OpenAI text-embedding-3-small (1536 dimensions)
CREATE TABLE IF NOT EXISTS chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create optimized indexes for Neon
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS chunks_document_id_idx ON chunks(document_id);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);

-- Verify tables and extensions
SELECT 'Documents table' as component, count(*) as records FROM documents
UNION ALL
SELECT 'Chunks table' as component, count(*) as records FROM chunks
UNION ALL
SELECT 'Extensions' as component, count(*) as records FROM pg_extension WHERE extname = 'vector';

-- Show table structure
\d+ documents;
\d+ chunks;