-- Setup script para PostgreSQL com pgvector
-- Execute este script no seu banco PostgreSQL

-- 1. Instalar extensão pgvector (se ainda não estiver instalada)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Criar tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar tabela de chunks com embeddings
CREATE TABLE IF NOT EXISTS chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI text-embedding-3-small usa 1536 dimensões
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Criar índice para busca por similaridade (opcional, mas recomendado para performance)
-- Nota: Este índice pode demorar para ser criado se já houver muitos dados
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 5. Criar índice adicional para queries por document_id
CREATE INDEX IF NOT EXISTS chunks_document_id_idx ON chunks(document_id);

-- 6. Verificar se tudo foi criado corretamente
\d+ documents;
\d+ chunks;
\dx vector;