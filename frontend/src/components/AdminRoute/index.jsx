import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
    const { isSignedIn, isLoaded, user } = useUser();

    if (!isLoaded) return <div className="admin-loading">Loading...</div>;

    if (!isSignedIn || user?.publicMetadata?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;