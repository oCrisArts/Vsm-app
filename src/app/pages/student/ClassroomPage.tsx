import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Classroom } from '../../components/Classroom';

export function ClassroomPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const id = Number(courseId);
  if (!id) return <Navigate to="/app/evoluir" replace />;

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      <Classroom
        courseId={id}
        onBack={() => navigate('/app/evoluir')}
        onStartLesson={lessonId => navigate(`/app/aprender/${id}/classroom/${lessonId}`)}
      />
    </div>
  );
}
