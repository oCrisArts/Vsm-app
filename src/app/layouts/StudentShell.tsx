import { Outlet, useNavigate, useLocation, Navigate } from 'react-router';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Sparkles, BookOpen, TrendingUp, Calendar, Library } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppHeader } from '../components/AppHeader';

const NAV_ITEMS = [
  { label: 'Iniciar',   Icon: Sparkles,   path: '/app/iniciar'   },
  { label: 'Aprender',  Icon: BookOpen,    path: '/app/aprender'  },
  { label: 'Evoluir',   Icon: TrendingUp,  path: '/app/evoluir'   },
  { label: 'Conectar',  Icon: Calendar,    path: '/app/conectar'  },
  { label: 'Consultar', Icon: Library,     path: '/app/consultar' },
];

const HEADER_H = 56;
const NAV_H    = 64;

export function StudentShell() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  if (!user)                 return <Navigate to="/login"             replace />;
  if (user.role !== 'student') return <Navigate to="/admin/comunidade" replace />;
  if (!user.onboardingDone)  return <Navigate to="/onboarding"        replace />;

  const activeIndex = NAV_ITEMS.findIndex(item =>
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      <AppHeader onOpenProfile={() => navigate('/app/perfil')} />

      <div style={{ paddingTop: HEADER_H, paddingBottom: NAV_H }}>
        <Outlet />
      </div>

      <Paper
        sx={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          bgcolor: '#121212',
          borderTop: '1px solid #2A2A2A',
          zIndex: 1000,
        }}
        elevation={8}
      >
        <BottomNavigation
          value={activeIndex === -1 ? false : activeIndex}
          onChange={(_, v) => navigate(NAV_ITEMS[v].path)}
          showLabels
          sx={{
            bgcolor: '#121212', height: `${NAV_H}px`,
            '& .MuiBottomNavigationAction-root': {
              color: '#666666', minWidth: '56px', padding: '6px 4px',
              '&.Mui-selected': { color: '#1E40AF' },
            },
            '& .MuiBottomNavigationAction-label': {
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '9px', fontWeight: 500, marginTop: '3px',
              opacity: 1, letterSpacing: '0.04em',
              '&.Mui-selected': { fontSize: '9px' },
            },
          }}
        >
          {NAV_ITEMS.map(({ label, Icon }) => (
            <BottomNavigationAction key={label} label={label} icon={<Icon size={22} />} />
          ))}
        </BottomNavigation>
      </Paper>
    </div>
  );
}
