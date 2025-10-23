import express from 'express';
import { listDocuments, getDocumentById, deleteDocument, getDocumentChunks } from '../services/dbService.js';

const router = express.Router();

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Listar todos os documentos
 *     description: Retorna uma lista de todos os documentos armazenados no banco de dados com informações sobre chunks
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Lista de documentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DocumentSummary'
 *             example:
 *               documents:
 *                 - id: 1
 *                   name: "Manual do Produto.txt"
 *                   created_at: "2023-10-22T18:30:00.000Z"
 *                   chunks_count: "15"
 *                 - id: 2
 *                   name: "Documentação da API.txt"
 *                   created_at: "2023-10-22T17:45:00.000Z"
 *                   chunks_count: "8"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", async (req, res) => {
    try {
        const documents = await listDocuments();
        res.json({ documents });
    } catch (error) {
        console.error("Error listing documents:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Obter documento por ID
 *     description: Retorna informações detalhadas de um documento específico
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do documento
 *     responses:
 *       200:
 *         description: Documento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentSummary'
 *       404:
 *         description: Documento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);

        if (isNaN(documentId)) {
            return res.status(400).json({ error: "Invalid document ID" });
        }

        const document = await getDocumentById(documentId);

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        res.json(document);
    } catch (error) {
        console.error("Error getting document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /documents/{id}/chunks:
 *   get:
 *     summary: Listar chunks de um documento
 *     description: Retorna todos os chunks de texto de um documento específico
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do documento
 *     responses:
 *       200:
 *         description: Chunks do documento retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chunks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Documento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/chunks", async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);

        if (isNaN(documentId)) {
            return res.status(400).json({ error: "Invalid document ID" });
        }

        // First check if document exists
        const document = await getDocumentById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        const chunks = await getDocumentChunks(documentId);
        res.json({ chunks });
    } catch (error) {
        console.error("Error getting document chunks:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /documents/{id}:
 *   delete:
 *     summary: Remover documento
 *     description: Remove um documento e todos os seus embeddings do banco de dados
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do documento a ser removido
 *     responses:
 *       200:
 *         description: Documento removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Document deleted successfully"
 *                 deletedDocument:
 *                   $ref: '#/components/schemas/DocumentSummary'
 *       404:
 *         description: Documento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Document not found"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);

        if (isNaN(documentId)) {
            return res.status(400).json({ error: "Invalid document ID" });
        }

        // First check if document exists
        const document = await getDocumentById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        const deletedDocument = await deleteDocument(documentId);

        res.json({
            message: "Document deleted successfully",
            deletedDocument: {
                id: deletedDocument.id,
                name: deletedDocument.name,
                created_at: deletedDocument.created_at
            }
        });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;