import { pool } from './src/services/dbService.js';

async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');

        // Test basic connection
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('✅ Database connection successful');
        console.log('Current time from DB:', result.rows[0].current_time);

        // Check if pgvector extension is installed
        const vectorCheck = await pool.query("SELECT * FROM pg_extension WHERE extname = 'vector'");
        if (vectorCheck.rows.length > 0) {
            console.log('✅ pgvector extension is installed');
        } else {
            console.log('❌ pgvector extension is NOT installed');
            console.log('Run: CREATE EXTENSION IF NOT EXISTS vector;');
        }

        // Check if tables exist
        const tablesCheck = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('documents', 'chunks')
        `);

        const existingTables = tablesCheck.rows.map(row => row.table_name);
        console.log('Existing tables:', existingTables);

        if (existingTables.includes('documents')) {
            console.log('✅ documents table exists');
        } else {
            console.log('❌ documents table missing');
        }

        if (existingTables.includes('chunks')) {
            console.log('✅ chunks table exists');

            // Check chunks table structure
            const chunksStructure = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'chunks' 
                ORDER BY ordinal_position
            `);
            console.log('Chunks table structure:');
            chunksStructure.rows.forEach(col => {
                console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
            });
        } else {
            console.log('❌ chunks table missing');
        }

    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();