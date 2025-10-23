import express from 'express';
import { pool } from "../services/dbService.js";
import { chunkText } from '../services/chunckService.js';
import { createEmbedding } from '../services/embeddingService.js';

const router = express.Router();

/**
 * @swagger
 * /ingest:
 *   post:
 *     summary: Ingestão de documento
 *     description: Processa um documento dividindo em chunks, gera embeddings e armazena no banco de dados
 *     tags: [Document Processing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngestRequest'
 *           example:
 *             name: "Manual do Produto"
 *             content: "Este é o conteúdo do documento que será processado. Ele será dividido em chunks menores para processamento de embeddings. Cada chunk terá no máximo 500 caracteres e será usado para busca semântica."
 *     responses:
 *       200:
 *         description: Documento processado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngestResponse'
 *             example:
 *               message: "Document ingested successfully"
 *               documentId: 123
 *               chunks: 5
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Missing 'name' or 'content' in request body"
 *       500:
 *         description: Erro interno do servidor
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
