// config/sqlServer.js
const sql = require('mssql');

const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Use this for local dev / self-signed certs
    }
};

let pool;

async function getSQLPool() {
    if (pool) {
        return pool;
    }
    try {
        pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

// Export both the function and sql object
module.exports = {
    getSQLPool,
    sql
};