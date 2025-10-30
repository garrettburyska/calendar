import { Navigate } from "react-router-dom";
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { loggedIn } = useAuth();
  
  if (!loggedIn) {
    return <Navigate to="/accounts/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
