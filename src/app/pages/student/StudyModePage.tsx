import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { StudyModeSupabase } from '../../components/StudyModeSupabase';

export function StudyModePage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  if (!lessonId || !slug) return <Navigate to="/app/aprender" replace />;

  return (
    <StudyModeSupabase
      lessonId={lessonId}
      userId={user.id}
      onClose={() => navigate(`/app/aprender/${slug}/classroom`)}
    />
  );
}
