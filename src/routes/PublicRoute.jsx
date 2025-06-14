import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ restricted = true }) => {
   return isAuthenticated() && restricted ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;