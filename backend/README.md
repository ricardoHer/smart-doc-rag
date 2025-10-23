# SmartDocRAG API

A RAG (Retrieval-Augmented Generation) system developed in TypeScript/Node.js that enables upload, processing, and intelligent querying of documents using OpenAI embeddings and PostgreSQL.

## 🚀 Features

- **Document Upload**: Upload text files
- **Intelligent Processing**: Chunk division and embedding generation
- **RAG Queries**: Semantic search and contextualized response generation
- **Documented API**: Complete Swagger/OpenAPI documentation
- **Document Management**: List, view, and delete documents with their embeddings

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL with pgvector extension
- OpenAI API key

## 🛠️ Installation

1. **Clone the repository and install dependencies:**

```bash
git clone <repository-url>
cd smartdocrag/backend
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit the `.env` file with your configurations:

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/smartdocrag
PORT=3000
NODE_ENV=development
```

3. **Configure PostgreSQL database:**

Run the setup script or execute manually:

```sql
-- Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create tables
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chunks (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI text-embedding-3-small uses 1536 dimensions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for similarity search
CREATE INDEX chunks_embedding_idx ON chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## 🎯 Usage

### Development

```bash
npm run dev
```

The server will start on http://localhost:3000 with hot reload enabled.

### Production

```bash
npm run build
npm start
```

### Other Scripts

```bash
npm run clean    # Clean compiled files
npm run build    # Compile TypeScript
npm test         # Run tests (if configured)
```

## 📚 API Documentation

Complete API documentation is available at:

- **Swagger UI**: http://localhost:3000/api-docs
- **JSON Spec**: http://localhost:3000/api-docs.json

## 🔗 Endpoints

### 1. File Upload

```http
POST /upload
Content-Type: multipart/form-data

Body: file (text file)
```

**Response:**

```json
{
  "fileName": "document.txt",
  "content": "File content..."
}
```

### 2. Document Ingestion

```http
POST /ingest
Content-Type: application/json

{
  "fileName": "Document name",
  "content": "Document content..."
}
```

**Response:**

```json
{
  "message": "Document ingested successfully",
  "documentId": 123,
  "chunks": 15
}
```

### 3. Document Management

```http
GET /documents
```

**Response:**

```json
{
  "documents": [
    {
      "id": 1,
      "name": "document.txt",
      "created_at": "2023-10-22T18:30:00.000Z",
      "chunks_count": "15"
    }
  ]
}
```

```http
DELETE /documents/{id}
```

**Response:**

```json
{
  "message": "Document deleted successfully",
  "deletedDocument": { ... }
}
```

### 4. RAG Query

```http
POST /query
Content-Type: application/json

{
  "question": "Your question here"
}
```

**Response:**

```json
{
  "answer": "AI-generated answer based on document context",
  "contextUsed": ["First 100 chars of each chunk used..."]
}
```

### 5. API Information

```http
GET /
```

**Response:**

```json
{
  "message": "SmartDocRAG API",
  "version": "1.0.0",
  "documentation": "/api-docs",
  "endpoints": {
    "upload": "/upload",
    "ingest": "/ingest",
    "query": "/query",
    "documents": "/documents"
  }
}
```

## 💡 Usage Flow

1. **Upload**: Send a text file via `/upload`
2. **Ingestion**: Use the returned content in `/ingest` to process the document
3. **Query**: Ask questions via `/query` to get answers based on documents
4. **Management**: List and delete documents via `/documents`

## 🏗️ Architecture

```
src/
├── index.ts              # Main Express server
├── config/
│   └── swagger.ts        # Swagger/OpenAPI configuration
├── routes/               # API endpoints
│   ├── upload.ts         # File upload
│   ├── ingest.ts         # Processing and ingestion
│   ├── query.ts          # RAG queries
│   └── documents.ts      # Document management
├── services/             # Service layer
│   ├── dbService.ts      # PostgreSQL connection pool
│   ├── embeddingService.ts # OpenAI embeddings generation
│   └── chunckService.ts  # Text chunking division
└── utils/
    └── logger.ts         # Logging utilities
```

## 🔧 Technology Stack

- **Runtime**: Node.js + TypeScript + ESModules
- **Framework**: Express.js
- **Database**: PostgreSQL + pgvector
- **AI**: OpenAI API (embeddings + GPT-4o-mini)
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **Dev Tools**: tsx, hot reload
- **CORS**: Configured for cross-origin requests

## 📊 AI Models Used

- **Embeddings**: `text-embedding-3-small` (1536 dimensions)
- **Chat**: `gpt-4o-mini`
- **Chunking**: Maximum 500 characters per chunk
- **Search**: Cosine similarity with vector search

## 🔐 Security

- Input validation on all endpoints
- Standardized error handling
- Parameterized queries (SQL injection protection)
- Environment variables for credentials
- CORS configuration for secure cross-origin requests

## 🐛 Troubleshooting

### Error: "Missing credentials"

- Verify that `OPENAI_API_KEY` is configured in `.env`
- Check that the API key is valid and has sufficient credits

### Error: "Connection refused"

- Verify that PostgreSQL is running
- Confirm the `DATABASE_URL` in `.env`
- Test database connection manually

### Error: "pgvector extension not found"

- Install the pgvector extension in PostgreSQL
- Execute: `CREATE EXTENSION IF NOT EXISTS vector;`
- Restart PostgreSQL if necessary

### Error: "Module not found" (ESModules)

- Ensure imports include `.js` extensions for local files
- Verify `"type": "module"` is set in `package.json`
- Check TypeScript configuration for ESModules

## 📝 Development Notes

The project uses ESModules with TypeScript. Key configurations:

- `package.json`: `"type": "module"`
- `tsconfig.json`: Configured for Node.js with ESModules
- Imports must include `.js` extensions for local files
- Hot reload enabled with `tsx watch`

### File Structure Convention

- Routes handle HTTP requests and validation
- Services contain business logic
- Database operations are centralized in `dbService.ts`
- Utilities provide shared functionality

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add Swagger documentation for new endpoints
- Include error handling for all operations
- Write descriptive commit messages
- Test endpoints manually or with automated tests

## 📄 License

ISC License
