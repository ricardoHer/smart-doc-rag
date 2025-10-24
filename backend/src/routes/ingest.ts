import express from 'express';
import { pool } from "../services/dbService.js";
import { chunkText } from '../services/chunckService.js';
import { createEmbedding } from '../services/embeddingService.js';

const router = express.Router();

/**
 * @swagger
 * /ingest:
 *   post:
 *     summary: Document ingestion
 *     description: Processes a document by splitting into chunks, generating embeddings and storing in database
 *     tags: [Document Processing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngestRequest'
 *           example:
 *             name: "Product Manual"
 *             content: "This is the document content that will be processed. It will be divided into smaller chunks for embedding processing. Each chunk will have a maximum of 500 characters and will be used for semantic search."
 *     responses:
 *       200:
 *         description: Document processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngestResponse'
 *             example:
 *               message: "Document ingested successfully"
 *               documentId: 123
 *               chunks: 5
 *       400:
 *         description: Required parameters missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Missing 'name' or 'content' in request body"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 */
router.post("/", async (req, res) => {
    try {
        const { fileName, content } = req.body;

        if (!fileName || !content) {
            return res.status(400).json({ error: "Missing 'name' or 'content' in request body" });
        }

        const doc = await pool.query(
            "INSERT INTO documents (name) VALUES ($1) RETURNING id",
            [fileName || 'Untitled Document']);

        const docId = doc.rows[0].id;
        const chunks = chunkText(content, 500);
        await createEmbedding(chunks, docId);
        res.status(200).json({ message: "Document ingested successfully", documentId: docId, chunks: chunks.length });


    } catch (error) {
        console.error("Error in /ingest route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
