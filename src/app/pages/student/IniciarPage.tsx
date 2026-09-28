import { useNavigate } from 'react-router';
import { Home } from '../../components/Home';

export function IniciarPage() {
  const navigate = useNavigate();
  return (
    <Home
      onNavigateToCourse={slug => navigate(`/app/aprender/${slug}`)}
      onNavigateToAgenda={() => navigate('/app/conectar')}
    />
  );
}
