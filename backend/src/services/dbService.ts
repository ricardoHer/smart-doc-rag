import pkg from 'pg';
const { Pool } = pkg;

// Database configuration with fallbacks
const dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10, // Reduced for session pooler
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000, // Increased timeout for Render
    // Session pooler specific settings
    statement_timeout: 300000, // 5 minutes
    query_timeout: 300000, // 5 minutes
    // Additional settings for better connectivity
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
};

console.log('Database config:', {
    connectionString: process.env.DATABASE_URL ? '***REDACTED***' : 'NOT SET',
    ssl: dbConfig.ssl,
    nodeEnv: process.env.NODE_ENV
});

export const pool = new Pool(dbConfig);

pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Test database connection with retry
export async function testConnection(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT NOW()');
            console.log(`Database connected successfully at: ${result.rows[0].now}`);
            client.release();
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Database connection attempt ${i + 1} failed:`, errorMessage);
            if (i === retries - 1) {
                console.error('All database connection attempts failed');
                return false;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return false;
}

// Document management functions
export async function listDocuments() {
    const query = `
        SELECT 
            d.id,
            d.name,
            d.created_at,
            COUNT(c.id) as chunks_count
        FROM documents d
        LEFT JOIN chunks c ON d.id = c.document_id
        GROUP BY d.id, d.name, d.created_at
        ORDER BY d.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
}

export async function getDocumentById(documentId: number) {
    const query = `
        SELECT 
            d.id,
            d.name,
            d.created_at,
            COUNT(c.id) as chunks_count
        FROM documents d
        LEFT JOIN chunks c ON d.id = c.document_id
        WHERE d.id = $1
        GROUP BY d.id, d.name, d.created_at
    `;

    const result = await pool.query(query, [documentId]);
    return result.rows[0];
}

export async function deleteDocument(documentId: number) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // First delete all chunks for this document
        await client.query('DELETE FROM chunks WHERE document_id = $1', [documentId]);

        // Then delete the document
        const result = await client.query('DELETE FROM documents WHERE id = $1 RETURNING *', [documentId]);

        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function getDocumentChunks(documentId: number) {
    try {
        const query = `
            SELECT 
                id,
                content
            FROM chunks
            WHERE document_id = $1
            ORDER BY id ASC
        `;

        const result = await pool.query(query, [documentId]);
        console.log(`Found ${result.rows.length} chunks for document ${documentId}`);
        return result.rows;
    } catch (error) {
        console.error('Error in getDocumentChunks:', error);
        throw error;
    }
}