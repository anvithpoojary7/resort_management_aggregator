import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // includes role
  const location = useLocation();

  if (!user) {
    // Redirect to login and preserve intended path
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
