import React from 'react'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'

function loader({ size = 'sm' }) {
    return (
        <div className={`flex justify-center items-center`}  >
            <svg className={`animate-rotate1 `} viewBox="25 25 50 50" style={{ width: size === 'sm' ? '40px' : '60px', height: size === 'sm' ? '40px' : '60px' }} >
                <circle
                    className="stroke-white animate-dash1"
                    cx="50"
                    cy="50"
                    r="20"
                />
            </svg>
        </div>

    )
}

export default loader