import { createBrowserRouter, Navigate } from 'react-router';

import { StudentShell }       from './layouts/StudentShell';
import { AdminShell }         from './layouts/AdminShell';

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

export const router = createBrowserRouter([
  /* ── public ── */
  { path: '/',        element: <Navigate to="/login" replace /> },
  { path: '/login',   element: <LoginPage /> },
  { path: '/cadastro',element: <CadastroPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },

  /* ── student app ─ with shell ── */
  {
    path: '/app',
    element: <StudentShell />,
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
  { path: '/app/aprender/:courseId',                            element: <CourseDetailPage /> },
  { path: '/app/aprender/:courseId/classroom',                  element: <ClassroomPage />    },
  { path: '/app/aprender/:courseId/classroom/:lessonId',        element: <StudyModePage />    },
  { path: '/app/perfil',                                        element: <PerfilPage />       },

  /* ── admin ─ with admin shell ── */
  {
    path: '/admin',
    element: <AdminShell />,
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
