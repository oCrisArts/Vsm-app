import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Login } from '../components/Login';

export function LoginPage() {
  const { user, authLoading, authError, login, register, loginWithGoogle, loginWithFacebook } = useAuth();

  if (!authLoading && user) {
    if (user.role === 'admin') return <Navigate to="/admin/comunidade" replace />;
    if (user.onboardingDone) return <Navigate to="/app/iniciar" replace />;
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-black dark">
      <Login authLoading={authLoading} authError={authError} onTryLogin={login} onTryRegister={register} onTryGoogleLogin={loginWithGoogle} onTryFacebookLogin={loginWithFacebook} />
    </div>
  );
}
