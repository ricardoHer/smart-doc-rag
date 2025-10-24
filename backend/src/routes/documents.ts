import express from 'express';
import { listDocuments, getDocumentById, deleteDocument, getDocumentChunks } from '../services/dbService.js';

const router = express.Router();

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: List all documents
 *     description: Returns a list of all documents stored in the database with chunk information
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Document list returned successfully
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
 *                   name: "Product Manual.txt"
 *                   created_at: "2023-10-22T18:30:00.000Z"
 *                   chunks_count: "15"
 *                 - id: 2
 *                   name: "API Documentation.txt"
 *                   created_at: "2023-10-22T17:45:00.000Z"
 *                   chunks_count: "8"
 *       500:
 *         description: Internal server error
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
 *     summary: Get document by ID
 *     description: Returns detailed information of a specific document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentSummary'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
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
 *     summary: List document chunks
 *     description: Returns all text chunks of a specific document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document chunks returned successfully
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
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
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
 *     summary: Delete a document
 *     description: Removes a document and all its associated chunks from the database
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the document to be deleted
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Document deleted successfully"
 *       400:
 *         description: Invalid document ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Document ID must be a valid number"
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Document not found"
 *       500:
 *         description: Internal server error
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