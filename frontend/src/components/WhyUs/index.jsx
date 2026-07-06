// components/WhyChooseUs/index.jsx
import React from 'react'
import { motion } from 'framer-motion'
import './index.css'

const features = [
    {
        id: 1,
        icon: '📚',
        title: 'Curated Collection',
        description: 'Every title hand-picked by readers who actually love books, not algorithms.'
    },
    {
        id: 2,
        icon: '🚚',
        title: 'Fast Delivery',
        description: 'Pan-India shipping with careful packaging, so your books arrive in perfect shape.'
    },
    {
        id: 3,
        icon: '💳',
        title: 'Secure Payments',
        description: 'Encrypted checkout with multiple payment options for total peace of mind.'
    },
    {
        id: 4,
        icon: '↩️',
        title: 'Easy Returns',
        description: "7-day hassle-free return policy if a book isn't the right fit for you."
    }
]

// Splits text into chars and types them out one by one
function TypeText({ text, className, charDelay = 0.03, startDelay = 0 }) {
    const letters = Array.from(text)

    return (
        <motion.span
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: charDelay, delayChildren: startDelay }}
            style={{ display: 'inline-block' }}
        >
            {letters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                    }}
                    style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    )
}

function WhyUs() {
    return (
        <section className="wcu-page">
            <div className="wcu-header">
                <p className="wcu-tag">
                    <TypeText text="Our Promise" charDelay={0.025} />
                </p>
                <h2 className="wcu-title">
                    <TypeText text="Why Choose Open Word" charDelay={0.035} startDelay={0.3} />
                </h2>
                <p className="wcu-subtitle">
                    <TypeText text="A few reasons readers stick with us" charDelay={0.02} startDelay={1.1} />
                </p>
            </div>

            <div className="wcu-grid">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.id}
                        className="wcu-card"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                    >
                        <div className="wcu-icon">{feature.icon}</div>
                        <h3 className="wcu-card-title">{feature.title}</h3>
                        <p className="wcu-card-description">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default WhyUs