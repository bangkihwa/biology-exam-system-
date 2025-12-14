import { pgTable, text, varchar, integer, timestamp, serial, boolean, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Schools table
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Exams table (학교별 시험 정보)
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  schoolName: text("school_name").notNull(),
  year: integer("year").notNull(),
  semester: text("semester").notNull(), // "2학기 중간", "2학기 기말" 등
  subject: text("subject").notNull().default("생명과학"),
});

// Questions table (문항별 정답 정보)
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id),
  questionNumber: integer("question_number").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // "객관식" or "주관식"
  category: text("category").notNull(), // "에너지", "화학", "생태계" 등
  unit: text("unit").notNull(), // "전자기 유도", "산화-환원" 등
  answer: text("answer").notNull(), // 단일 정답 또는 복수 정답 (JSON array)
  isMultipleAnswer: boolean("is_multiple_answer").notNull().default(false),
}, (table) => ({
  uniqueQuestionPerExam: uniqueIndex("unique_question_per_exam").on(table.examId, table.questionNumber),
}));

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 50 }).notNull().unique(),
  studentName: text("student_name").notNull(),
  grade: text("grade").notNull(),
  phone: varchar("phone", { length: 20 }),
});

// Submissions table (학생 답안 제출 기록)
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 50 }).notNull(),
  studentName: text("student_name").notNull(),
  examId: integer("exam_id").notNull().references(() => exams.id),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  answers: text("answers").notNull(), // JSON string of student answers
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answeredQuestions: integer("answered_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  achievementRate: integer("achievement_rate").notNull(),
  unitResults: text("unit_results").notNull(), // JSON string of unit-wise results
});

// Settings table for app configuration
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations - defined after all tables are declared
export const schoolsRelations = relations(schools, ({ many }) => ({
  exams: many(exams),
}));

export const examsRelations = relations(exams, ({ one, many }) => ({
  school: one(schools, {
    fields: [exams.schoolId],
    references: [schools.id],
  }),
  questions: many(questions),
  submissions: many(submissions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  student: one(students, {
    fields: [submissions.studentId],
    references: [students.studentId],
  }),
  exam: one(exams, {
    fields: [submissions.examId],
    references: [exams.id],
  }),
}));

// Insert schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

// Additional schemas for API
export const studentAnswerSchema = z.object({
  questionNumber: z.number(),
  answer: z.string(),
});

export type StudentAnswer = z.infer<typeof studentAnswerSchema>;

export const submitTestSchema = z.object({
  studentId: z.string(),
  studentName: z.string(),
  examId: z.number(),
  answers: z.array(studentAnswerSchema),
});

export type SubmitTest = z.infer<typeof submitTestSchema>;

export const submitUnitTestSchema = z.object({
  studentId: z.string().min(1, "학생 ID가 필요합니다"),
  studentName: z.string().min(1, "이름이 필요합니다"),
  unitName: z.string().min(1, "단원명이 필요합니다"),
  answers: z.array(studentAnswerSchema),
});

export type SubmitUnitTest = z.infer<typeof submitUnitTestSchema>;

export const loginSchema = z.object({
  studentId: z.string().min(1, "학생 ID를 입력해주세요"),
  studentName: z.string().min(1, "이름을 입력해주세요"),
});

export type Login = z.infer<typeof loginSchema>;

// Constants - 고등 생명과학 선행 단원 분류 (에이원 런지 교재)
export const categories = [
  "생명과학",
] as const;

export type Category = typeof categories[number];

export const units = [
  "생물의 특성과 물질대사",
  "기관계 통합적 작용",
  "자극의 전달",
  "신경계",
  "항상성 조절",
  "방어 작용",
  "염색체와 세포분열",
  "생물의 진화",
] as const;

export type Unit = typeof units[number];

export const SUBJECT_NAME = "고등 생명과학 선행";

// 단원별 문제 번호 범위 (에이원 런지 교재 기준)
export const unitQuestionRanges: Record<string, { start: number; end: number; excludes?: number[] }> = {
  "생물의 특성과 물질대사": { start: 1, end: 60 },
  "기관계 통합적 작용": { start: 61, end: 118 },
  "자극의 전달": { start: 119, end: 180 },
  "신경계": { start: 181, end: 240 },
  "항상성 조절": { start: 241, end: 300 },
  "방어 작용": { start: 301, end: 360 },
  "염색체와 세포분열": { start: 361, end: 420 },
  "생물의 진화": { start: 421, end: 447 },
};

// 단원별 카테고리 매핑
export const unitCategoryMap: Record<string, string> = {
  "생물의 특성과 물질대사": "생명과학",
  "기관계 통합적 작용": "생명과학",
  "자극의 전달": "생명과학",
  "신경계": "생명과학",
  "항상성 조절": "생명과학",
  "방어 작용": "생명과학",
  "염색체와 세포분열": "생명과학",
  "생물의 진화": "생명과학",
};

// Unit result interface for detailed feedback
export interface UnitResult {
  category: string;
  unit: string;
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  achievementRate: number;
}
