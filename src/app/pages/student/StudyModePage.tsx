import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { StudyMode } from '../../components/StudyMode';

export function StudyModePage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const lid = Number(lessonId);
  const cid = Number(courseId);
  if (!lid || !cid) return <Navigate to="/app/evoluir" replace />;

  return (
    <StudyMode
      lessonId={lid}
      onClose={() => navigate(`/app/aprender/${cid}/classroom`)}
    />
  );
}
