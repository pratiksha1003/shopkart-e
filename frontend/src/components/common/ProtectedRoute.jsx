import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo } = useSelector((s) => s.auth);
  if (!userInfo) return <Navigate to="/login" replace />;
  if (adminOnly && !userInfo.isAdmin) return <Navigate to="/" replace />;
  return children;
};
