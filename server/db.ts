import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// 연결 풀 설정 개선 - Supabase 무료 플랜 최적화
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // 연결 풀 설정
  max: 5,                        // 최대 연결 수 (무료 플랜에 맞게 제한)
  min: 1,                        // 최소 연결 수
  idleTimeoutMillis: 30000,      // 유휴 연결 타임아웃 (30초)
  connectionTimeoutMillis: 10000, // 연결 타임아웃 (10초)
  allowExitOnIdle: true,         // 유휴 시 종료 허용
});

// 연결 에러 핸들링
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
  // 연결 오류 시 자동 재연결 시도하지 않고 로깅만 함
});

pool.on('connect', () => {
  console.log('Database pool: New client connected');
});

// 연결 테스트 함수
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connection successful:', result.rows[0].now);
    return true;
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

export const db = drizzle(pool, { schema });
