import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { ClassroomSupabase } from '../../components/ClassroomSupabase';

export function ClassroomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  if (!slug) return <Navigate to="/app/aprender" replace />;

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      <ClassroomSupabase
        slug={slug}
        userId={user.id}
        onBack={() => navigate('/app/aprender')}
        onStartLesson={lessonId => navigate(`/app/aprender/${slug}/classroom/${lessonId}`)}
      />
    </div>
  );
}
