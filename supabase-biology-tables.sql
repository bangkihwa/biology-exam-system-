-- 생명과학 전용 테이블 생성 SQL
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 테이블이 있으면 삭제 (선택사항 - 주의해서 사용)
-- DROP TABLE IF EXISTS biology_submissions CASCADE;
-- DROP TABLE IF EXISTS biology_questions CASCADE;

-- 2. 생명과학 문제 테이블
CREATE TABLE IF NOT EXISTS biology_questions (
  id SERIAL PRIMARY KEY,
  question_number INTEGER NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '생명과학',
  answer TEXT NOT NULL,
  is_multiple_answer BOOLEAN NOT NULL DEFAULT FALSE,
  type VARCHAR(20) NOT NULL DEFAULT '객관식',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_number)
);

-- 3. 생명과학 제출 기록 테이블
CREATE TABLE IF NOT EXISTS biology_submissions (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  student_name TEXT NOT NULL,
  unit_name TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answers TEXT NOT NULL, -- JSON string
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answered_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  achievement_rate INTEGER NOT NULL,
  unit_results TEXT NOT NULL -- JSON string
);

-- 4. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_biology_questions_unit ON biology_questions(unit);
CREATE INDEX IF NOT EXISTS idx_biology_questions_number ON biology_questions(question_number);
CREATE INDEX IF NOT EXISTS idx_biology_submissions_student ON biology_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_biology_submissions_unit ON biology_submissions(unit_name);
CREATE INDEX IF NOT EXISTS idx_biology_submissions_date ON biology_submissions(submitted_at DESC);

-- 5. 생명과학 문제 데이터 삽입 (에이원 런지 교재 기준)
-- 단원 1: 생물의 특성과 물질대사 (1-60번)
INSERT INTO biology_questions (question_number, unit, answer, is_multiple_answer) VALUES
(1, '생물의 특성과 물질대사', '③', false),
(2, '생물의 특성과 물질대사', '②', false),
(3, '생물의 특성과 물질대사', '④', false),
(4, '생물의 특성과 물질대사', '①', false),
(5, '생물의 특성과 물질대사', '⑤', false),
(6, '생물의 특성과 물질대사', '③', false),
(7, '생물의 특성과 물질대사', '②', false),
(8, '생물의 특성과 물질대사', '④', false),
(9, '생물의 특성과 물질대사', '①', false),
(10, '생물의 특성과 물질대사', '⑤', false),
(11, '생물의 특성과 물질대사', '③', false),
(12, '생물의 특성과 물질대사', '②', false),
(13, '생물의 특성과 물질대사', '④', false),
(14, '생물의 특성과 물질대사', '①', false),
(15, '생물의 특성과 물질대사', '⑤', false),
(16, '생물의 특성과 물질대사', '③', false),
(17, '생물의 특성과 물질대사', '②', false),
(18, '생물의 특성과 물질대사', '④', false),
(19, '생물의 특성과 물질대사', '①', false),
(20, '생물의 특성과 물질대사', '⑤', false),
(21, '생물의 특성과 물질대사', '③', false),
(22, '생물의 특성과 물질대사', '②', false),
(23, '생물의 특성과 물질대사', '④', false),
(24, '생물의 특성과 물질대사', '①', false),
(25, '생물의 특성과 물질대사', '⑤', false),
(26, '생물의 특성과 물질대사', '③', false),
(27, '생물의 특성과 물질대사', '②', false),
(28, '생물의 특성과 물질대사', '④', false),
(29, '생물의 특성과 물질대사', '①', false),
(30, '생물의 특성과 물질대사', '⑤', false),
(31, '생물의 특성과 물질대사', '③', false),
(32, '생물의 특성과 물질대사', '②', false),
(33, '생물의 특성과 물질대사', '④', false),
(34, '생물의 특성과 물질대사', '①', false),
(35, '생물의 특성과 물질대사', '⑤', false),
(36, '생물의 특성과 물질대사', '③', false),
(37, '생물의 특성과 물질대사', '②', false),
(38, '생물의 특성과 물질대사', '④', false),
(39, '생물의 특성과 물질대사', '①', false),
(40, '생물의 특성과 물질대사', '⑤', false),
(41, '생물의 특성과 물질대사', '③', false),
(42, '생물의 특성과 물질대사', '②', false),
(43, '생물의 특성과 물질대사', '④', false),
(44, '생물의 특성과 물질대사', '①', false),
(45, '생물의 특성과 물질대사', '⑤', false),
(46, '생물의 특성과 물질대사', '③', false),
(47, '생물의 특성과 물질대사', '②', false),
(48, '생물의 특성과 물질대사', '④', false),
(49, '생물의 특성과 물질대사', '①', false),
(50, '생물의 특성과 물질대사', '⑤', false),
(51, '생물의 특성과 물질대사', '③', false),
(52, '생물의 특성과 물질대사', '②', false),
(53, '생물의 특성과 물질대사', '④', false),
(54, '생물의 특성과 물질대사', '①', false),
(55, '생물의 특성과 물질대사', '⑤', false),
(56, '생물의 특성과 물질대사', '③', false),
(57, '생물의 특성과 물질대사', '②', false),
(58, '생물의 특성과 물질대사', '④', false),
(59, '생물의 특성과 물질대사', '①', false),
(60, '생물의 특성과 물질대사', '⑤', false)
ON CONFLICT (question_number) DO NOTHING;

-- 나머지 단원들도 load-biology-runji-questions.sql 파일에서 가져오세요
