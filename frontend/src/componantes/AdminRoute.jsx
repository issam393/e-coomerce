import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // 1. Get user from storage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Check if user exists AND is Admin
  // Note: Ensure your Login API returns the 'role' in the user object
  if (user && user.role === 'ADMIN') {
    return <Outlet />; // Render the Admin component
  }

  // 3. If not admin, redirect to Home or Login
  return <Navigate to="/" replace />;
};

export default AdminRoute;