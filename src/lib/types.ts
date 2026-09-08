// ─── Auth / Identity ───────────────────────────────────────────

export type Role = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  role: Role;
  avatar_url: string | null;
  vsm_score: number;
  vsm_level: number;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Courses ───────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  image_url: string | null;
  tag: string;
  description: string | null;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// ─── Modules ───────────────────────────────────────────────────

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
}

// ─── Lessons ───────────────────────────────────────────────────

export type LessonType = 'video' | 'text' | 'audio';

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  duration: string;
  type: LessonType;
  content_url: string | null;
  order_index: number;
  created_at: string;
}

// ─── Quizzes ───────────────────────────────────────────────────

export interface Quiz {
  id: string;
  course_id: string | null;
  lesson_id: string | null;
  title: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
}

// ─── Enrollments ───────────────────────────────────────────────

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

// ─── Progress ──────────────────────────────────────────────────

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

// ─── Contacts (CRM / Social Pipeline) ─────────────────────────

export type ContactStage =
  | 'Abridor Enviado'
  | 'Conversa Fluindo'
  | 'Conforto Estabelecido'
  | 'Encontro Solicitado';

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  photo_url: string | null;
  stage: ContactStage;
  platform: string;
  last_contact: string | null;
  notes: string;
  meeting_date: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Evolution — Body ──────────────────────────────────────────

export interface BodyLog {
  id: string;
  user_id: string;
  weight: number | null;
  body_fat: number | null;
  logged_at: string;
  created_at: string;
}

// ─── Evolution — Diet ──────────────────────────────────────────

export interface DietLog {
  id: string;
  user_id: string;
  calories: number;
  meal_label: string | null;
  logged_at: string;
  created_at: string;
}

// ─── Evolution — Finance ───────────────────────────────────────

export interface FinanceRecord {
  id: string;
  user_id: string;
  month_year: string;
  income: number;
  expenses: number;
  created_at: string;
  updated_at: string;
}

// ─── Evolution — Metrics (VSM sub-scores) ─────────────────────

export interface EvolutionMetric {
  id: string;
  user_id: string;
  metric_name: string;
  value: number;
  recorded_at: string;
}

// ─── Aggregate helpers ─────────────────────────────────────────

export interface CourseWithProgress extends Course {
  enrolled: boolean;
  progress_pct: number;
  lessons_done: number;
  lessons_total: number;
  modules: Array<Module & { lessons: Lesson[] }>;
}
