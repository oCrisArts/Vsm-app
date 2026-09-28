import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { CourseLandingSupabase } from '../../components/CourseLandingSupabase';

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user, enrolledCourses, enrollCourse } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  if (!slug) return <Navigate to="/app/aprender" replace />;

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      <CourseLandingSupabase
        slug={slug}
        onBack={() => navigate('/app/aprender')}
        onEnroll={async courseId => { await enrollCourse(courseId); navigate(`/app/aprender/${slug}/classroom`); }}
        enrolledCourseIds={enrolledCourses}
        onOpenClassroom={() => navigate(`/app/aprender/${slug}/classroom`)}
      />
    </div>
  );
}
