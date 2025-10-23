# ✅ EXECUTANDO: Migração para Neon.tech

## 🎯 Passos que você deve fazer:

### 1. ✅ Criar Conta e Projeto

1. Acesse: https://neon.tech
2. Sign up com GitHub (recomendado)
3. Create Project:
   - **Name:** `smartdocrag`
   - **Region:** US East (Ohio)
   - **PostgreSQL version:** 15 (padrão)

### 2. ✅ Copiar Connection String

1. No dashboard do projeto → **Connection Details**
2. Copie a string que começa com: `postgresql://...`
3. Exemplo: `postgresql://username:password@host.neon.tech/dbname?sslmode=require`

### 3. ✅ Configurar no Render

1. Render Dashboard → Backend Service → Settings
2. Environment Variables → Edit `DATABASE_URL`
3. **Cole a connection string do Neon**
4. Save Changes (redeploy automático)

### 4. ✅ Executar Schema SQL

1. **Neon Dashboard** → SQL Editor
2. **Cole e execute o script abaixo:**

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chunks table with vector embeddings
CREATE TABLE IF NOT EXISTS chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS chunks_document_id_idx ON chunks(document_id);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);
```

### 5. ✅ Verificar Funcionamento

Após redeploy do Render, verificar logs para:

```
Database connected successfully at: [timestamp]
```

## 🔄 Status da Migração

- [ ] Conta criada no Neon
- [ ] Projeto criado
- [ ] Connection string copiada
- [ ] DATABASE_URL atualizada no Render
- [ ] Schema SQL executado
- [ ] Aplicação funcionando

## ⚡ Vantagens Obtidas

- ✅ Sem problemas de conectividade
- ✅ Gratuito até 0.5GB
- ✅ Performance excelente
- ✅ pgvector nativo
- ✅ Serverless (escala automaticamente)

## 📞 Suporte

Se houver algum problema, me avise em qual passo você está!
