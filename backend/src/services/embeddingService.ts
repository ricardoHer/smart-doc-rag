import OpenAI from "openai";
import { pool } from "./dbService.js";

let openai: OpenAI;

function getOpenAIClient(): OpenAI {
    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
}

export async function createEmbedding(chhunks: string[], docId: number) {
    const openaiClient = getOpenAIClient();

    console.log(`Processing ${chhunks.length} chunks for document ${docId}`);

    for (const chunk of chhunks) {
        try {
            const res = await openaiClient.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
            });

            const embedding = res?.data[0]?.embedding || null;

            if (!embedding) {
                console.error("Failed to create embedding for chunk:", chunk);
                continue;
            };

            // Convert array to PostgreSQL vector format
            const vectorString = `[${embedding.join(',')}]`;

            console.log(`Inserting chunk with embedding vector of ${embedding.length} dimensions`);

            await pool.query(
                "INSERT INTO chunks (document_id, content, embedding) VALUES ($1, $2, $3)",
                [docId, chunk, vectorString]
            );

            console.log(`Successfully inserted chunk for document ${docId}`);
        } catch (error) {
            console.error(`Error processing chunk for document ${docId}:`, error);
            throw error; // Re-throw to stop the process if there's an error
        }
    }

    console.log(`Completed processing all chunks for document ${docId}`);
}