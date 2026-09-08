import { Navigate, useNavigate, useParams } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { CourseLanding } from '../../components/CourseLanding';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, enrolledCourses, enrollCourse } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  if (!courseId) return <Navigate to="/app/aprender" replace />;

  const isEnrolled = enrolledCourses.includes(courseId);

  const handleEnroll = async (cid: number) => {
    await enrollCourse(String(cid));
    navigate(`/app/aprender/${cid}/classroom`);
  };

  const numericId = Number(courseId);

  return (
    <div className="min-h-screen dark" style={{ backgroundColor: '#121212' }}>
      <CourseLanding
        courseId={numericId || 0}
        onBack={() => navigate('/app/aprender')}
        onEnroll={handleEnroll}
        isEnrolled={isEnrolled}
        onOpenClassroom={cid => navigate(`/app/aprender/${cid}/classroom`)}
      />
    </div>
  );
}
