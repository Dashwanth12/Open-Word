import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import './admin.css';

function AdminLayout() {
    const navigate = useNavigate();

    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span>OPEN WORD</span>
                    <small>Admin Panel</small>
                </div>

                <nav className="admin-nav">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive ? 'admin-nav-link active' : 'admin-nav-link'
                        }
                    >
                        📚 Books
                    </NavLink>
                </nav>

                <div className="admin-sidebar-footer">
                    <UserButton afterSignOutUrl="/" />
                    <button
                        className="admin-back-btn"
                        onClick={() => navigate('/home')}
                    >
                        ← Back to Store
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;