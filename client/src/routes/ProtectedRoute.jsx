import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // { role: 'admin' | 'owner' | 'user', email }

  if (!user) {
    // User not logged in
    return <Navigate to="/auth" />;
  }

  if (user.role !== role) {
    // Logged in but wrong role
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  // Access granted
  return children;
};

export default ProtectedRoute;