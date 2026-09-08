import { useNavigate } from 'react-router';
import { Home } from '../../components/Home';

export function IniciarPage() {
  const navigate = useNavigate();
  return (
    <Home
      onNavigateToCourse={id => navigate(`/app/aprender/${id}`)}
      onNavigateToAgenda={() => navigate('/app/conectar')}
    />
  );
}
