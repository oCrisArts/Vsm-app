import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Course, Lesson, LessonBlock, Module, Quiz, QuizQuestion } from '../types';

export type AdminLesson = Lesson & { lesson_blocks: LessonBlock[] };
export type AdminCourse = Course & {
  cover_src: string | null;
  modules: Array<Module & { lessons: AdminLesson[] }>;
};
export type AdminQuiz = Quiz & { quiz_questions: QuizQuestion[] };

const isRemoteUrl = (value: string | null | undefined) => Boolean(value && /^https?:\/\//i.test(value));

async function signedUrl(bucket: string, value: string | null) {
  if (!value || isRemoteUrl(value)) return value;
  const result = await supabase.storage.from(bucket).createSignedUrl(value, 3600);
  return result.data?.signedUrl ?? null;
}

export function useAdminLearning() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [courseResult, quizResult] = await Promise.all([
      supabase.from('courses').select('*, modules(*, lessons(*, lesson_blocks(*)))').order('order_index'),
      supabase.from('quizzes').select('*, quiz_questions(*)'),
    ]);
    const firstError = courseResult.error ?? quizResult.error;
    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }
    const values = (courseResult.data ?? []) as AdminCourse[];
    await Promise.all(values.map(async course => {
      course.cover_src = await signedUrl('course-covers', course.image_url);
      course.modules.sort((a, b) => a.order_index - b.order_index);
      course.modules.forEach(module => {
        module.lessons.sort((a, b) => a.order_index - b.order_index);
        module.lessons.forEach(lesson => lesson.lesson_blocks.sort((a, b) => a.order_index - b.order_index));
      });
    }));
    setCourses(values);
    setQuizzes(((quizResult.data ?? []) as AdminQuiz[]).map(quiz => ({
      ...quiz,
      quiz_questions: [...quiz.quiz_questions].sort((a, b) => a.order_index - b.order_index),
    })));
    setLoading(false);
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  return { courses, quizzes, loading, error, reload };
}

function extension(file: File) {
  return file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
}

export async function uploadLearningAsset(bucket: 'course-covers' | 'lesson-media', file: File, folder: string) {
  const path = `${folder}/${crypto.randomUUID()}.${extension(file)}`;
  const result = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type || undefined });
  if (result.error) throw result.error;
  return result.data.path;
}

export async function removeLearningAsset(bucket: 'course-covers' | 'lesson-media', value: string | null | undefined) {
  if (!value || isRemoteUrl(value)) return;
  await supabase.storage.from(bucket).remove([value]);
}

export const learningAdmin = {
  createCourse: (payload: Partial<Course>) => supabase.from('courses').insert(payload).select().single(),
  updateCourse: (id: string, payload: Partial<Course>) => supabase.from('courses').update(payload).eq('id', id).select().single(),
  deleteCourse: (id: string) => supabase.from('courses').delete().eq('id', id),
  createModule: (payload: Partial<Module>) => supabase.from('modules').insert(payload).select().single(),
  updateModule: (id: string, payload: Partial<Module>) => supabase.from('modules').update(payload).eq('id', id).select().single(),
  deleteModule: (id: string) => supabase.from('modules').delete().eq('id', id),
  createLesson: (payload: Partial<Lesson>) => supabase.from('lessons').insert(payload).select().single(),
  updateLesson: (id: string, payload: Partial<Lesson>) => supabase.from('lessons').update(payload).eq('id', id).select().single(),
  deleteLesson: (id: string) => supabase.from('lessons').delete().eq('id', id),
  createBlock: (payload: Partial<LessonBlock>) => supabase.from('lesson_blocks').insert(payload).select().single(),
  updateBlock: (id: string, payload: Partial<LessonBlock>) => supabase.from('lesson_blocks').update(payload).eq('id', id).select().single(),
  deleteBlock: (id: string) => supabase.from('lesson_blocks').delete().eq('id', id),
  createQuiz: (payload: Partial<Quiz>) => supabase.from('quizzes').insert(payload).select().single(),
  updateQuiz: (id: string, payload: Partial<Quiz>) => supabase.from('quizzes').update(payload).eq('id', id).select().single(),
  deleteQuiz: (id: string) => supabase.from('quizzes').delete().eq('id', id),
  createQuestion: (payload: Partial<QuizQuestion>) => supabase.from('quiz_questions').insert(payload).select().single(),
  updateQuestion: (id: string, payload: Partial<QuizQuestion>) => supabase.from('quiz_questions').update(payload).eq('id', id).select().single(),
  deleteQuestion: (id: string) => supabase.from('quiz_questions').delete().eq('id', id),
};
