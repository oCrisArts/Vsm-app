import { Navigate, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileNew } from '../../components/ProfileNew';

export function PerfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const handleClose = () => navigate('/app/iniciar');

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      {/* Back bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-5 py-3"
        style={{ backgroundColor: 'rgba(18,18,18,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #2A2A2A', height: 56 }}
      >
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A' }}
        >
          <ChevronLeft size={16} className="text-white" />
        </button>
        <span className="text-white text-sm" style={{ fontWeight: 500 }}>Perfil</span>
      </div>

      <div style={{ paddingTop: 56 }}>
        <ProfileNew onClose={handleClose} onLogout={logout} />
      </div>
    </div>
  );
}
