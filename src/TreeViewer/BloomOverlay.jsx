import { useEffect, useState } from 'react'

// Generate random petals on mount
function generatePetals(count, isDark) {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,           // % from left
        delay: Math.random() * 2,          // seconds
        duration: 3 + Math.random() * 3,   // seconds
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 360,
        scale: 0.6 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 80, // horizontal drift px
        color: isDark
            ? `hsl(330, ${80 + Math.random() * 20}%, ${60 + Math.random() * 20}%)`
            : `hsl(${110 + Math.random() * 20}, ${50 + Math.random() * 20}%, ${35 + Math.random() * 15}%)`,
    }))
}

function FallingPetal({ petal, isDark }) {
    return (
        <div style={{
            position: 'absolute',
            left: `${petal.x}%`,
            top: '-60px',
            pointerEvents: 'none',
            animation: `petalFall ${petal.duration}s ${petal.delay}s ease-in infinite`,
            zIndex: 210,
        }}>
            <svg
                width="24" height="28"
                viewBox="-12 -32 24 34"
                style={{
                    transform: `scale(${petal.scale}) rotate(${petal.rotation}deg)`,
                    animation: `petalSpin ${petal.duration}s ${petal.delay}s linear infinite`,
                }}
            >
                {/* Money plant / blossom leaf shape */}
                <path
                    d="M 0 0 C -10 -8 -18 -20 -12 -32 C -6 -44 8 -44 12 -32 C 18 -20 10 -8 0 0 Z"
                    fill={petal.color}
                    opacity="0.85"
                />
                <path
                    d="M 0 0 C -1 -10 -1 -22 0 -32"
                    stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.3)'}
                    strokeWidth="0.8"
                    fill="none"
                />
            </svg>
        </div>
    )
}

export default function BloomOverlay({ node, onClose, COLORS, isDark }) {
    const [petals] = useState(() => generatePetals(22, isDark))

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: `${COLORS.bg}F0`,
                zIndex: 200, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '60px 40px', backdropFilter: 'blur(6px)',
                animation: 'fadeIn 0.3s ease', cursor: 'pointer',
                transition: 'background 0.4s ease',
                overflow: 'hidden',
            }}
        >
            {/* Falling petals */}
            {petals.map(petal => (
                <FallingPetal key={petal.id} petal={petal} isDark={isDark} />
            ))}

            {/* Content */}
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', width: '100%', cursor: 'default', position: 'relative', zIndex: 215 }}>
                <div style={{
                    fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
                    color: node.type === 'leaf' ? COLORS.gold : COLORS.olive,
                    marginBottom: '16px',
                }}>
                    {node.type === 'leaf' ? '✦ leaf node' : 'branch node'}
                </div>
                <h1 style={{
                    fontSize: '38px', fontWeight: '400', color: COLORS.text,
                    lineHeight: '1.2', margin: '0 0 28px', letterSpacing: '-0.5px',
                }}>
                    {node.title}
                </h1>
                <div style={{ width: '40px', height: '2px', background: COLORS.olive, marginBottom: '28px' }} />
                <div style={{ fontSize: '17px', lineHeight: '1.85', color: COLORS.text, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {node.summary}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '40px', background: 'none',
                        border: `1px solid ${COLORS.border}`, borderRadius: '8px',
                        padding: '10px 24px', cursor: 'pointer', fontSize: '12px',
                        color: COLORS.textMuted, fontFamily: "'Georgia', serif", letterSpacing: '1px',
                    }}
                >
                    close [esc]
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0 }
                    to { opacity: 1 }
                }
                @keyframes petalFall {
                    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 0.8; }
                    100% { transform: translateY(110vh) translateX(${Math.random() * 80 - 40}px); opacity: 0; }
                }
                @keyframes petalSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}