import { Outlet, useNavigate, useLocation, Navigate } from 'react-router';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Users, BookOpen, TrendingUp, Calendar, Library, Bell, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Comunidade', Icon: Users,      path: '/admin/comunidade' },
  { label: 'Ensinar',    Icon: BookOpen,   path: '/admin/ensinar'    },
  { label: 'Evoluir',    Icon: TrendingUp, path: '/admin/evoluir'    },
  { label: 'Conectar',   Icon: Calendar,   path: '/admin/conectar'   },
  { label: 'Consultar',  Icon: Library,    path: '/admin/consultar'  },
];

const HEADER_H = 56;
const NAV_H    = 64;

export function AdminShell() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  if (!user)                return <Navigate to="/login"        replace />;
  if (user.role !== 'admin') return <Navigate to="/app/iniciar" replace />;

  const activeIndex = NAV_ITEMS.findIndex(item =>
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      {/* Admin Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3.5"
        style={{
          backgroundColor: 'rgba(18,18,18,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #2A2A2A',
          height: HEADER_H,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1E40AF' }}>
            <Shield size={14} className="text-white" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-white text-sm" style={{ fontWeight: 500, letterSpacing: '0.06em' }}>CÓDIGO</span>
            <span className="text-sm" style={{ color: '#1E40AF', fontWeight: 500, letterSpacing: '0.06em' }}>DA SEDUÇÃO</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: 'rgba(30,64,175,0.2)', color: '#93C5FD', fontWeight: 500, letterSpacing: '0.04em' }}>ADMIN</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <button
            className="relative w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A' }}
          >
            <Bell size={15} style={{ color: '#9E9E9E' }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#1E40AF', border: '2px solid #121212' }} />
          </button>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', border: '2px solid #7C3AED', color: '#fff', fontWeight: 500 }}
          >
            AD
          </button>
        </div>
      </div>

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
              '&.Mui-selected': { color: '#7C3AED' },
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
