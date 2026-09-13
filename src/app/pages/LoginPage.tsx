import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Login } from '../components/Login';

export function LoginPage() {
  const { user, login, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/comunidade" replace />;
    if (user.onboardingDone)   return <Navigate to="/app/iniciar"      replace />;
    return <Navigate to="/onboarding" replace />;
  }

  const handleLogin = (role: 'student' | 'admin') => {
    if (role === 'admin') navigate('/admin/comunidade');
    else navigate('/app/iniciar'); // StudentShell redirects to /onboarding if needed
  };

  const handleTryLogin = async (email: string, password: string) => {
    return login(email, password);
  };

  const handleTryGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      // OAuth will redirect the browser, so we don't need to do anything here
      // The OAuthCallbackPage will handle the redirect back
    }
    return result;
  };

  const handleTryFacebookLogin = async () => {
    const result = await loginWithFacebook();
    if (result.success) {
      // OAuth will redirect the browser, so we don't need to do anything here
      // The OAuthCallbackPage will handle the redirect back
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-black dark">
      <Login onLogin={handleLogin} onTryLogin={handleTryLogin} onTryGoogleLogin={handleTryGoogleLogin} onTryFacebookLogin={handleTryFacebookLogin} />
    </div>
  );
}
