import { db } from "./server/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadData() {
  console.log("생명과학 런지 교재 데이터 로드 시작...");

  try {
    // Part 1: 기본 설정 + 생물의 특성과 물질대사 + 기관계 통합적 작용 + 자극의 전달
    console.log("\nPart 1 실행 중...");
    const part1 = fs.readFileSync(
      join(__dirname, "load-biology-questions.sql"),
      "utf-8"
    );
    await db.execute(sql.raw(part1));
    console.log("✓ Part 1 완료 (1-180번 문제)");

    // Part 2: 신경계 + 항상성 조절 + 방어 작용
    console.log("\nPart 2 실행 중...");
    const part2 = fs.readFileSync(
      join(__dirname, "load-biology-questions-part2.sql"),
      "utf-8"
    );
    await db.execute(sql.raw(part2));
    console.log("✓ Part 2 완료 (181-360번 문제)");

    // Part 3: 염색체와 세포분열 + 생물의 진화
    console.log("\nPart 3 실행 중...");
    const part3 = fs.readFileSync(
      join(__dirname, "load-biology-questions-part3.sql"),
      "utf-8"
    );
    await db.execute(sql.raw(part3));
    console.log("✓ Part 3 완료 (361-447번 문제)");

    console.log("\n✅ 모든 데이터 로드 완료!");
    console.log("총 447문제 (8개 단원)");

    // 확인
    const result = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM questions
      WHERE exam_id IN (
        SELECT id FROM exams WHERE subject = '생명과학'
      )
    `);
    console.log(`\n데이터베이스 확인: ${result.rows[0].count}개 문제 로드됨`);

  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  }

  process.exit(0);
}

loadData();
