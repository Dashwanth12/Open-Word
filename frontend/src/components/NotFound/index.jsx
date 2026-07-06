import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import './index.css';

function NotFound() {
    return (
        <div className='error-page'>
            <div className='error-container'>
                <div className='error-visual'>
                    <span className='error-code'>404</span>
                    <div className='error-icon-wrapper'>
                        <Compass size={40} strokeWidth={1.2} className='error-icon' />
                    </div>
                </div>

                <h1 className='error-title'>The Story Has Gone Missing</h1>
                <p className='error-message'>
                    The page you are looking for might have been rewritten, moved, or never existed in our catalog. Let's get you back on track.
                </p>

                <div className='error-actions'>
                    <Link to='/' className='error-btn primary'>
                        Go to Homepage
                    </Link>
                    <Link to='/books' className='error-btn secondary'>
                        Browse Our Books
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;