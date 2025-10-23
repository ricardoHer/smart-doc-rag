import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import iploadRouter from './routes/upload.js';
import ingestrouter from './routes/ingest.js';
import queryRouter from './routes/query.js';
import documentsRouter from './routes/documents.js';
import { setupSwagger } from './config/swagger.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow frontend and any other local development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Define routes
app.use('/upload', iploadRouter);
app.use('/ingest', ingestrouter);
app.use('/query', queryRouter);
app.use('/documents', documentsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'SmartDocRAG API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            upload: '/upload',
            ingest: '/ingest',
            query: '/query',
            documents: '/documents'
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});