import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Login } from '../components/Login';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/comunidade" replace />;
    if (user.onboardingDone)   return <Navigate to="/app/iniciar"      replace />;
    return <Navigate to="/onboarding" replace />;
  }

  const handleLogin = (role: 'student' | 'admin') => {
    if (role === 'admin') navigate('/admin/comunidade');
    else if (user?.onboardingDone) navigate('/app/iniciar');
    else navigate('/onboarding');
  };

  const handleTryLogin = async (email: string, password: string) => {
    return login(email, password);
  };

  return (
    <div className="min-h-screen bg-black dark">
      <Login onLogin={handleLogin} onTryLogin={handleTryLogin} />
    </div>
  );
}
