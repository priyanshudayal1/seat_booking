import { Navigate } from 'react-router-dom';
import useLoginStore from '../store/useLogin';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useLoginStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;