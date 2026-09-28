import type { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import { createBrowserRouter, Navigate } from 'react-router';

import { StudentShell }       from './layouts/StudentShell';
import { AdminShell }         from './layouts/AdminShell';

import { LandingPage }        from './pages/LandingPage';
import { LoginPage }          from './pages/LoginPage';
import { CadastroPage }       from './pages/CadastroPage';
import { OnboardingPage }     from './pages/OnboardingPage';

import { IniciarPage }        from './pages/student/IniciarPage';
import { AprenderPage }       from './pages/student/AprenderPage';
import { CourseDetailPage }   from './pages/student/CourseDetailPage';
import { ClassroomPage }      from './pages/student/ClassroomPage';
import { StudyModePage }      from './pages/student/StudyModePage';
import { EvoluirPage }        from './pages/student/EvoluirPage';
import { ConectarPage }       from './pages/student/ConectarPage';
import { ConsultarPage }      from './pages/student/ConsultarPage';
import { PerfilPage }         from './pages/student/PerfilPage';

import { ComunidadePage }     from './pages/admin/ComunidadePage';
import { EnsinoPage }         from './pages/admin/EnsinoPage';
import { AdminEvoluirPage }   from './pages/admin/AdminEvoluirPage';
import { AdminConectarPage }  from './pages/admin/AdminConectarPage';
import { AdminConsultarPage } from './pages/admin/AdminConsultarPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, authLoading } = useAuth();
  if (authLoading) return <div className="min-h-screen bg-black dark" role="status" aria-label="Carregando sessão" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  /* ── public ── */
  { path: '/',        element: <LandingPage /> },
  { path: '/login',   element: <LoginPage /> },
  { path: '/cadastro',element: <CadastroPage /> },
  { path: '/onboarding', element: <RequireAuth><OnboardingPage /></RequireAuth> },

  /* ── student app ─ with shell ── */
  {
    path: '/app',
    element: <RequireAuth><StudentShell /></RequireAuth>,
    children: [
      { index: true,           element: <Navigate to="/app/iniciar" replace /> },
      { path: 'iniciar',       element: <IniciarPage />    },
      { path: 'aprender',      element: <AprenderPage />   },
      { path: 'evoluir',       element: <EvoluirPage />    },
      { path: 'conectar',      element: <ConectarPage />   },
      { path: 'consultar',     element: <ConsultarPage />  },
    ],
  },

  /* ── student deep routes ─ no shell ── */
  { path: '/app/aprender/:courseId',                            element: <RequireAuth><CourseDetailPage /></RequireAuth> },
  { path: '/app/aprender/:courseId/classroom',                  element: <RequireAuth><ClassroomPage /></RequireAuth>    },
  { path: '/app/aprender/:courseId/classroom/:lessonId',        element: <RequireAuth><StudyModePage /></RequireAuth>    },
  { path: '/app/perfil',                                        element: <RequireAuth><PerfilPage /></RequireAuth>       },

  /* ── admin ─ with admin shell ── */
  {
    path: '/admin',
    element: <RequireAuth><AdminShell /></RequireAuth>,
    children: [
      { index: true,           element: <Navigate to="/admin/comunidade" replace /> },
      { path: 'comunidade',    element: <ComunidadePage />    },
      { path: 'ensinar',       element: <EnsinoPage />        },
      { path: 'evoluir',       element: <AdminEvoluirPage />  },
      { path: 'conectar',      element: <AdminConectarPage /> },
      { path: 'consultar',     element: <AdminConsultarPage />},
    ],
  },

  /* ── 404 ── */
  { path: '*', element: <Navigate to="/login" replace /> },
]);
