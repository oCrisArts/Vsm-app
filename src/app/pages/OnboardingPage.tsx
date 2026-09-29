import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Onboarding } from '../components/Onboarding';
import { useState } from 'react';

export function OnboardingPage() {
  const { user, markOnboardingDone } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  if (!user)                return <Navigate to="/login"             replace />;
  if (user.role === 'admin') return <Navigate to="/admin/comunidade" replace />;
  if (user.onboardingDone)  return <Navigate to="/app/iniciar"       replace />;

  const handleComplete = async () => {
    try {
      setError(null);
      await markOnboardingDone();
      navigate('/app/iniciar');
    } catch {
      setError('Não foi possível concluir o onboarding. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-black dark">
      {error && <div role="alert" className="fixed top-4 left-4 right-4 z-[100] rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-red-300 text-sm">{error}</div>}
      <Onboarding onComplete={handleComplete} />
    </div>
  );
}
