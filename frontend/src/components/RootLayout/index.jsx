import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import Footer from '../../components/Footer'
import {useCart} from '../../context/CartContext'
import Sidebar from '../Sidebar';
import './index.css';

function RootLayout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isSignedIn } = useUser();
    const nav = useNavigate()
    const {cartCount} = useCart()

    return (
        <div className="layout-wrapper">
            <header className="main-header">
                <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)}>
                    ☰
                </button>

                <div className="brand-logo">OPEN WORD</div>

                <div className="header-right">
                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <button className="auth-btn auth-btn--ghost">Sign In</button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="auth-btn auth-btn--filled">Sign Up</button>
                            </SignUpButton>
                        </>
                    )}

                    <div className="cart-indicator">
                        <span onClick={() => nav('/cart')}>🛒</span>
                        <span className="cart-count" onClick={() => nav('/cart')}>{cartCount}</span>
                    </div>
                </div>
            </header>

            <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            <main>
                <Outlet />
                <Footer />
            </main>
        </div>
    );
}

export default RootLayout;