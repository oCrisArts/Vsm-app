import { useNavigate } from 'react-router';
import { Evolucao } from '../../components/Evolucao';

export function EvoluirPage() {
  const navigate = useNavigate();
  return <Evolucao onSelectCourse={id => navigate(`/app/aprender/${id}/classroom`)} />;
}
