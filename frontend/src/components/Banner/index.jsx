import Button from '../Button';
import './index.css'

function Banner() {
    return (
        <section className="hero-section">
            <img
                className="hero-bg-image"
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200"
                alt="Dark moody library shelves"
            />
            <div className="hero-bg-overlay" />

            <div className="hero-content">
                <span className="hero-eyebrow">STORE One</span>

                <h1 className="hero-title">
                    <span className="hero-title-italic">Lose</span>
                    <span className="hero-title-uncial"> Yourself</span>
                    {' '}Between the{' '}
                    <span className="hero-title-outline">pages</span>
                </h1>

                <p className="hero-description">
                    A curated world of fiction, romance and ideas, waiting on
                    the shelf for the right reader. That's you.
                </p>

                <div className="hero-buttons">
                    <Button />
                </div>
            </div>

            <div className="hero-badge">
                <span className="hero-badge-number">12K+</span>
                <span className="hero-badge-label">titles</span>
            </div>

            <blockquote className="hero-quote">
                <p>OPEN: MON - FRI: 11:00AM - 6:30PM</p>
            </blockquote>
        </section>
    )
}

export default Banner;