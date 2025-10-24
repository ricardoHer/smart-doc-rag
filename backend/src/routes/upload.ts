import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: File upload
 *     description: Uploads a text file and returns the extracted content
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
 *                 description: Text file for upload
 *     responses:
 *       200:
 *         description: Upload completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *             example:
 *               fileName: "document.txt"
 *               content: "Text file content..."
 *       400:
 *         description: No file was sent
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "No file uploaded."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');

        // Try reading with UTF-8 first, fallback to latin1 if needed
        let text: string;
        try {
            text = fs.readFileSync(req.file.path, 'utf-8');
            // Validate if the text contains any invalid UTF-8 characters
            if (text.includes('�')) {
                throw new Error('Invalid UTF-8 encoding detected');
            }
        } catch (error) {
            console.log('UTF-8 failed, trying latin1 encoding...');
            // Fallback to latin1 and convert to UTF-8
            const buffer = fs.readFileSync(req.file.path);
            text = buffer.toString('latin1');
            // Convert special characters if needed
            text = text.replace(/[^\x00-\x7F]/g, (char) => {
                const code = char.charCodeAt(0);
                if (code === 0xE1) return 'á';
                if (code === 0xE9) return 'é';
                if (code === 0xED) return 'í';
                if (code === 0xF3) return 'ó';
                if (code === 0xFA) return 'ú';
                if (code === 0xE0) return 'à';
                if (code === 0xE2) return 'â';
                if (code === 0xE3) return 'ã';
                if (code === 0xE7) return 'ç';
                return char;
            });
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ fileName: req.file.originalname, content: text });
    } catch (error) {
        console.error("Error in /upload route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;