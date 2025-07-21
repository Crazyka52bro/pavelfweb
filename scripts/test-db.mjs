// test-db.mjs
import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

async function testDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('🔗 Testing database connection...');
    const healthCheck = await sql`SELECT 1 as health_check`;
    console.log('✅ Database connection successful');

    console.log('📊 Testing tables...');
    
    // Test articles table
    try {
      const articleCount = await sql`SELECT COUNT(*) as count FROM articles`;
      console.log(`   📝 Articles: ${articleCount[0].count} rows`);
    } catch (err) {
      console.log(`   ❌ Articles table not found or cannot be accessed`);
    }

    // Test subscribers table
    try {
      const subscriberCount = await sql`SELECT COUNT(*) as count FROM subscribers`;
      console.log(`   📧 Subscribers: ${subscriberCount[0].count} rows`);
    } catch (err) {
      console.log(`   ❌ Subscribers table not found or cannot be accessed`);
    }

    // Test newsletter_subscribers table (pokud existuje)
    try {
      const newsletterSubCount = await sql`SELECT COUNT(*) as count FROM newsletter_subscribers`;
      console.log(`   📧 Newsletter subscribers: ${newsletterSubCount[0].count} rows`);
    } catch (err) {
      console.log(`   ℹ️ Newsletter subscribers table not found`);
    }

    // Test admin_users table
    try {
      const adminCount = await sql`SELECT COUNT(*) as count FROM admin_users`;
      console.log(`   👤 Admin users: ${adminCount[0].count} rows`);
    } catch (err) {
      console.log(`   ❌ Admin users table not found or cannot be accessed`);
    }

    // Test categories table
    try {
      const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`;
      console.log(`   🏷️ Categories: ${categoryCount[0].count} rows`);
    } catch (err) {
      console.log(`   ❌ Categories table not found or cannot be accessed`);
    }

    console.log('✅ Database test completed successfully');
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

// Spuštění testů, pokud je skript volán přímo
if (import.meta.url === import.meta.main) {
  testDatabase();
}

export { testDatabase };
