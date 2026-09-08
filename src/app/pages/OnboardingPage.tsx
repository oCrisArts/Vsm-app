import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Onboarding } from '../components/Onboarding';

export function OnboardingPage() {
  const { user, markOnboardingDone } = useAuth();
  const navigate = useNavigate();

  if (!user)                return <Navigate to="/login"             replace />;
  if (user.role === 'admin') return <Navigate to="/admin/comunidade" replace />;
  if (user.onboardingDone)  return <Navigate to="/app/iniciar"       replace />;

  const handleComplete = async () => {
    await markOnboardingDone();
    navigate('/app/iniciar');
  };

  return (
    <div className="min-h-screen bg-black dark">
      <Onboarding onComplete={handleComplete} />
    </div>
  );
}
