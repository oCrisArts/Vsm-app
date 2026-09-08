import { useNavigate } from 'react-router';
import { Marketplace } from '../../components/Marketplace';

export function AprenderPage() {
  const navigate = useNavigate();
  return <Marketplace onSelectCourse={id => navigate(`/app/aprender/${id}`)} />;
}
