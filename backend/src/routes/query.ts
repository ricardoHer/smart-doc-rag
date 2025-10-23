import express from 'express';
import OpenAI from 'openai';
import { pool } from '../services/dbService.js';

const router = express.Router();

let openai: OpenAI;

function getOpenAIClient(): OpenAI {
    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
}

/**
 * @swagger
 * /query:
 *   post:
 *     summary: Consulta RAG
 *     description: Realiza uma consulta usando RAG (Retrieval-Augmented Generation) para obter respostas baseadas nos documentos processados
 *     tags: [Query]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QueryRequest'
 *           example:
 *             question: "Como funciona o sistema de pagamento?"
 *     responses:
 *       200:
 *         description: Consulta realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QueryResponse'
 *             example:
 *               answer: "O sistema de pagamento funciona através de múltiplas opções incluindo cartão de crédito, débito e PIX..."
 *               contextUsed: [
 *                 "O pagamento pode ser realizado através de cartão de crédito, débito ou PIX. Para utilizar o",
 *                 "sistema de pagamento, acesse a seção de cobrança no menu principal. Todas as transações são"
 *               ]
 *       400:
 *         description: Pergunta não fornecida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Missing 'question' in request body"
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
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Missing 'question' in request body" });
        }

        const openaiClient = getOpenAIClient();

        const embeddingRes = await openaiClient.embeddings.create({
            model: "text-embedding-3-small",
            input: question,
        });

        const vector = embeddingRes?.data[0]?.embedding;

        if (!vector) {
            return res.status(500).json({ error: "Failed to create embedding for question" });
        }

        // Convert array to PostgreSQL vector format
        const vectorString = `[${vector.join(',')}]`;

        const results = await pool.query(
            "SELECT content, embedding <-> $1 AS distance FROM chunks ORDER BY distance ASC LIMIT 5",
            [vectorString]
        );

        const context = results.rows.map((r: any) => r.content).join("\n---\n");
        const completion = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Answer based on the context below:" },
                { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` },
            ],
        });

        res.json(
            {
                answer: completion?.choices[0]?.message?.content || "No answer generated.",
                contextUsed: results?.rows?.map((r: any) => r.content.slice(0, 100)) || "", // return first 100 chars of each context chunk 
            });

    } catch (error) {
        console.error("Error in /query route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;