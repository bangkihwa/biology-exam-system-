import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Neon serverless client - Vercel 서버리스 환경에서도 작동
const sql = neon(process.env.DATABASE_URL);

// 연결 테스트 함수
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful:', result[0].now);
    return true;
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

export const db = drizzle(sql, { schema });
