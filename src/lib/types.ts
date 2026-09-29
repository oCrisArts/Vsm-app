// ─── Auth / Identity ───────────────────────────────────────────

export type Role = 'student' | 'admin';

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: Role;
  avatar_url: string | null;
  vsm_score: number;
  vsm_level: number;
  total_xp: number;
  shape_score: number;
  finance_score: number;
  knowledge_score: number;
  social_score: number;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

export type ProfileUpdate = Pick<
  Profile,
  'display_name' | 'avatar_url' | 'onboarding_done'
>;

// ─── Courses ───────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
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
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// ─── Lessons ───────────────────────────────────────────────────

export type LessonBlockType = 'video' | 'text' | 'image' | 'audio';

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  duration: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface LessonBlock {
  id: string;
  lesson_id: string;
  type: LessonBlockType;
  title: string | null;
  content: string;
  media_url: string | null;
  order_index: number;
  created_at: string;
}

// ─── Quizzes ───────────────────────────────────────────────────

export interface Quiz {
  id: string;
  course_id: string | null;
  lesson_id: string | null;
  title: string;
  description: string;
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

// ─── VSM / Gamification ──────────────────────────────────────

export interface VsmHistoryEntry {
  id: string;
  user_id: string;
  score: number;
  event_type: string;
  description: string | null;
  created_at: string;
}

export type XpEventType = 'lesson_completed' | 'quiz_completed' | 'course_completed' | 'achievement';

export interface XpEvent {
  id: string;
  user_id: string;
  event_type: XpEventType;
  points: number;
  source_type: 'lesson' | 'quiz' | 'course' | 'achievement';
  source_id: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  xp_reward: number;
  is_active: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

// ─── Library ──────────────────────────────────────────────────

export type LibraryItemType = 'audio' | 'book' | 'script' | 'pdf';

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  cover_url: string | null;
  file_url: string | null;
  content: string | null;
  duration_minutes: number | null;
  pages: number | null;
  line_count: number | null;
  views: number;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type LibraryItemInput = Omit<LibraryItem, 'id' | 'created_at' | 'updated_at' | 'views'> & {
  views?: number;
};

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

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface QuizWithQuestions extends Quiz {
  quiz_questions: QuizQuestion[];
}
