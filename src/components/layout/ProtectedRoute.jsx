import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner.jsx';

/** Requires login; optionally restricts to `roles`. */
export default function ProtectedRoute({ roles }) {
  const { user, token, initializing } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (initializing || !user) return <Spinner full />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
