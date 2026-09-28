import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import type { Role } from '../../lib/types';
import { PASSWORD_MIN_LENGTH, PASSWORD_ERROR } from '../../lib/authValidation';

export type { Role };

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: Role;
  onboardingDone: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  authLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; role?: Role; error?: string }>;
  loginWithFacebook: () => Promise<{ success: boolean; role?: Role; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; needsEmailConfirmation?: boolean; error?: string }>;
  logout: () => Promise<void>;
  markOnboardingDone: () => Promise<void>;
  enrolledCourses: string[];
  enrollCourse: (courseId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    username: data.email,
    displayName: data.display_name,
    email: data.email,
    role: data.role as Role,
    onboardingDone: data.onboarding_done,
  };
}

async function fetchEnrollments(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', userId);
  return (data ?? []).map((e: { course_id: string }) => e.course_id);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authRevision = useRef(0);
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<{ session: Session | null; initialized: boolean }>({ session: null, initialized: false });
  const { session } = authState;
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    let authEventReceived = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      authEventReceived = true;
      authRevision.current += 1;
      setAuthLoading(true);
      setAuthError(null);
      setUser(null);
      setEnrolledCourses([]);
      // Keep this callback synchronous; profile queries run in the effect below.
      setAuthState(previous => ({ ...previous, session: nextSession }));
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error && !authEventReceived) setAuthError(error.message);
      setAuthState(previous => ({
        session: authEventReceived ? previous.session : data.session,
        initialized: true,
      }));
    }).catch(() => {
      if (!active) return;
      setAuthError('Não foi possível recuperar a sessão. Tente novamente.');
      setAuthState(previous => ({ ...previous, initialized: true }));
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!authState.initialized) return;
    let active = true;
    const revision = authRevision.current;
    const isCurrent = () => active && revision === authRevision.current;
    const loadUserData = async () => {
      try {
        if (!session) return;
        const profile = await fetchProfile(session.user.id);
        if (!isCurrent()) return;
        setUser(profile);
        if (!profile) {
          setAuthError('Sua sessão está ativa, mas seu perfil ainda não está disponível.');
          return;
        }
        const enrolled = await fetchEnrollments(session.user.id);
        if (isCurrent()) setEnrolledCourses(enrolled);
      } catch {
        if (isCurrent()) {
          setUser(null);
          setAuthError('Não foi possível carregar seu perfil. Tente novamente.');
        }
      } finally {
        if (isCurrent()) setAuthLoading(false);
      }
    };
    void loadUserData();
    return () => { active = false; };
  }, [authState, session]);

  const login = useCallback(async (email: string, password: string) => {
    if (password.length < PASSWORD_MIN_LENGTH) return { success: false, error: PASSWORD_ERROR };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.session) return { success: false, error: 'Sessão não iniciada.' };
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
        skipBrowserRedirect: false
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const loginWithFacebook = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/login`,
        skipBrowserRedirect: false
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    if (password.length < PASSWORD_MIN_LENGTH) return { success: false, error: PASSWORD_ERROR };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Falha ao criar usuário.' };
    return { success: true, needsEmailConfirmation: !data.session };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const markOnboardingDone = useCallback(async () => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ onboarding_done: true })
      .eq('id', user.id);
    setUser(u => u ? { ...u, onboardingDone: true } : null);
  }, [user]);

  const enrollCourse = useCallback(async (courseId: string) => {
    if (!user) return;
    await supabase.from('enrollments').upsert(
      { user_id: user.id, course_id: courseId },
      { onConflict: 'user_id,course_id' }
    );
    setEnrolledCourses(prev => prev.includes(courseId) ? prev : [...prev, courseId]);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, authLoading, authError, login, loginWithGoogle, loginWithFacebook, register, logout, markOnboardingDone, enrolledCourses, enrollCourse }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
