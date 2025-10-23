# SmartDocRAG

> Intelligent Document Retrieval-Augmented Generation System

SmartDocRAG is a comprehensive RAG (Retrieval-Augmented Generation) system that enables intelligent document upload, processing, and querying using OpenAI embeddings and PostgreSQL vector search.

![SmartDocRAG Interface](https://via.placeholder.com/800x400/1f2937/ffffff?text=SmartDocRAG+Interface)

## 🌟 Features

- **📄 Document Upload & Processing**: Upload text files and automatically process them into searchable chunks
- **🧠 AI-Powered Search**: Semantic search using OpenAI embeddings with vector similarity
- **💬 Intelligent Chat**: Ask questions about your documents and get contextual answers
- **🗂️ Document Management**: List, view, and delete uploaded documents
- **📚 API Documentation**: Complete Swagger/OpenAPI documentation
- **🎨 Modern UI**: ChatGPT-inspired interface with collapsible sidebar
- **⚡ Real-time Updates**: Hot reload and live document list updates

## 🏗️ Architecture

SmartDocRAG consists of two main components:

### Backend API (`/backend`)

- **TypeScript + Node.js + Express**
- **PostgreSQL with pgvector extension**
- **OpenAI API integration**
- **RESTful API with Swagger documentation**

### Frontend UI (`/smartdocrag-ui`)

- **React + Vite + Tailwind CSS**
- **Modern responsive design**
- **Real-time document management**
- **Chat interface with message history**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL with pgvector extension
- OpenAI API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smartdocrag
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev
```

### 3. Frontend Setup

```bash
cd ../smartdocrag-ui
npm install
npm run dev
```

### 4. Database Setup

```sql
-- Install pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Run the setup script
-- See backend/database/setup.sql for complete schema
```

## 📋 Environment Variables

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/smartdocrag
PORT=3000
NODE_ENV=development
```

## 🎯 Usage Flow

1. **Upload Documents**: Upload text files through the interface
2. **Automatic Processing**: Documents are automatically chunked and embedded
3. **Ask Questions**: Use the chat interface to ask questions about your documents
4. **Get Answers**: Receive AI-generated answers based on document content
5. **Manage Documents**: View, select, and delete documents from the sidebar

## 📡 API Endpoints

### Document Operations

- `GET /documents` - List all documents
- `GET /documents/{id}` - Get document details
- `DELETE /documents/{id}` - Delete a document
- `GET /documents/{id}/chunks` - Get document chunks

### File Processing

- `POST /upload` - Upload a file
- `POST /ingest` - Process and embed document content

### AI Operations

- `POST /query` - Ask questions about documents

### Documentation

- `GET /api-docs` - Swagger UI
- `GET /api-docs.json` - OpenAPI specification

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + pgvector
- **AI**: OpenAI API (text-embedding-3-small + gpt-4o-mini)
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **Development**: tsx, hot reload

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## 📊 AI Models

- **Embeddings**: `text-embedding-3-small` (1536 dimensions)
- **Chat Completion**: `gpt-4o-mini`
- **Chunk Size**: Maximum 500 characters per chunk
- **Similarity Search**: Cosine distance with ivfflat index

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server
npm run clean        # Clean build files
```

### Frontend Development

```bash
cd smartdocrag-ui
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🏗️ Project Structure

```
smartdocrag/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── database/           # Database setup scripts
│   └── package.json
├── smartdocrag-ui/         # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── services/       # API client
│   └── package.json
└── README.md               # This file
```

## 🚦 Running in Production

### Backend Production

```bash
cd backend
npm run build
npm start
```

### Frontend Production

```bash
cd smartdocrag-ui
npm run build
# Serve the dist/ directory with your preferred web server
```

## 🔒 Security Features

- Input validation on all endpoints
- SQL injection protection with parameterized queries
- CORS configuration for cross-origin requests
- Environment variable configuration for sensitive data
- Error handling with appropriate HTTP status codes

## 🐛 Troubleshooting

### Common Issues

**OpenAI API Errors**

- Verify `OPENAI_API_KEY` is set correctly
- Check your OpenAI account has sufficient credits

**Database Connection Issues**

- Ensure PostgreSQL is running
- Verify `DATABASE_URL` format
- Check pgvector extension is installed

**CORS Errors**

- Backend CORS is configured for `localhost:5173` (frontend)
- Update CORS settings if using different ports

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# Check API health
curl http://localhost:3000/
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the embedding and chat completion APIs
- PostgreSQL team for the excellent database system
- pgvector team for the vector similarity search extension
- React and Vite teams for the amazing development experience

## 📞 Support

If you have any questions or need help, please:

1. Check the [API Documentation](http://localhost:3000/api-docs)
2. Review the troubleshooting section above
3. Open an issue on GitHub

---

Made with ❤️ for intelligent document processing
