// scripts/test-database.mjs
import 'dotenv/config';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // V Neonu je SSL nutné, ale bez ověřování
  },
});

console.log('🔍 Testing Neon PostgreSQL connection...');

client
  .connect()
  .then(() => {
    console.log('✅ Successfully connected to the database!');
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Database connection test failed:');
    console.error(err.message);
    process.exit(1);
  });
