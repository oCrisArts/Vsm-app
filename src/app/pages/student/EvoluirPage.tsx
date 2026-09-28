import { useNavigate } from 'react-router';
import { Evolucao } from '../../components/Evolucao';

export function EvoluirPage() {
  const navigate = useNavigate();
  return <Evolucao onSelectCourse={slug => navigate(`/app/aprender/${slug}/classroom`)} />;
}
