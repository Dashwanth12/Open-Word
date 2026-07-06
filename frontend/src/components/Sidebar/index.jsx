import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import store from '../../assets/images/store.jpeg'
import './index.css';

const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'About', path: '/about' },
    { label: 'Books', path: '/books' },
    { label: 'Best Sellers', path: '/bestSellers' },
    {label: 'Cart', path: '/cart'}
];

function Sidebar({ isOpen, onClose }) {

    return (
        <>
            <div
                className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar panel */}
            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                <button className="sidebar-close-btn" onClick={onClose}>
                    ✕
                </button>

                <nav className="sidebar-nav">
                    {navLinks.map((link, index) => (
                        <NavLink
                            key={`${link.path}-${index}`}
                            to={link.path}
                            className={({ isActive }) =>
                                `sidebar-nav-link ${isActive ? 'sidebar-nav-link--active' : ''}`
                            }
                            onClick={onClose}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-store-card">
                    <div className="sidebar-store-img">
                        <img src={store} alt="Open Word Store" />
                    </div>
                        <span className="sidebar-store-label">
                            Open Word Store
                        </span>       
                </div>

                <div className="sidebar-footer">Open Word © 2026</div>
            </aside>
        </>
    );
}

export default Sidebar;