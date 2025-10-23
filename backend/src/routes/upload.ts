import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload de arquivo
 *     description: Faz upload de um arquivo de texto e retorna o conteúdo extraído
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de texto para upload
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *             example:
 *               fileName: "documento.txt"
 *               content: "Conteúdo do arquivo de texto..."
 *       400:
 *         description: Nenhum arquivo foi enviado
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "No file uploaded."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');
        const text = fs.readFileSync(req.file.path, 'utf-8');
        res.json({ fileName: req.file.originalname, content: text });
    } catch (error) {
        console.error("Error in /upload route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;