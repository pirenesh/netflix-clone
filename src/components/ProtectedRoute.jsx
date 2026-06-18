import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = UserAuth();

  if (!user) {
    // Redirect to Landing/Home gate page if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
}
