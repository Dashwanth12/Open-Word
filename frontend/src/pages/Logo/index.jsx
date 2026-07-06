import { useEffect } from 'react'
import { animate } from 'animejs'
import { useNavigate } from 'react-router-dom'
import './index.css'

function Logo() {
    const navigate = useNavigate()

    useEffect(() => {
        const text = document.querySelector('.flow-text')

        if (!text) return

        const length = text.getComputedTextLength()

        text.style.strokeDasharray = length
        text.style.strokeDashoffset = length

        animate('.flow-text', {
            strokeDashoffset: [length, 0],
            duration: 4000,
            ease: 'inOutSine',
            onComplete: () => {
                text.classList.add('finished')
            }
        })
    }, [])

    return (
        <div className="logo-container">
            <svg width="1000" height="250">
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="flow-text"
                >
                    OPEN WORD
                </text>
            </svg>
            <div className='sub-log'>
                <h3>Books • Knowledge • Imagination</h3>
            </div>
            <div className='enter-btn'>
                <button onClick={() => navigate('/home')}>TURN THE PAGE -</button>
            </div>
        </div>
    )
}

export default Logo