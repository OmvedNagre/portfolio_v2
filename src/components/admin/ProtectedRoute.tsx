import { Navigate, Outlet } from 'react-router-dom';
import { isOwner, useAuth } from '../../lib/auth';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isOwner(user)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
