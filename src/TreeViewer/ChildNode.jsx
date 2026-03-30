import { useState } from 'react'

export default function ChildNode({
    node,
    idx,
    total,
    isZoomTarget,
    isZoomingIn,
    onClick,
    onRightClick,
    COLORS
}) {
    const [hovered, setHovered] = useState(false)

    const isLeaf = node.type === 'leaf'
    const childCount = node.children?.length || 0

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                flex: total <= 3 ? '0 0 260px' : '0 0 200px',
                maxWidth: total <= 3 ? '280px' : '220px',
                minWidth: '160px',
            }}
        >
            <div
                onClick={onClick}
                onContextMenu={onRightClick}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: `1px solid ${hovered ? COLORS.olive : COLORS.border}`,
                    background: hovered ? `${COLORS.olive}10` : COLORS.surface,
                    transition: 'all 0.25s ease',
                    transform: hovered
                        ? 'translateY(-6px) scale(1.03)'
                        : isZoomTarget && isZoomingIn
                            ? 'scale(1.2) translateZ(80px)'
                            : 'translateY(0) scale(1)',
                    boxShadow: hovered
                        ? `0 12px 40px ${COLORS.olive}22`
                        : '0 2px 8px rgba(0,0,0,0.04)',
                }}
            >
                <div style={{
                    fontSize: '10px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: isLeaf ? COLORS.gold : COLORS.olive,
                    marginBottom: '10px',
                }}>
                    {isLeaf ? '✦ leaf' : `${childCount} branch${childCount !== 1 ? 'es' : ''}`}
                </div>

                <div style={{
                    fontSize: total <= 3 ? '18px' : '15px',
                    color: COLORS.text,
                    fontWeight: '400',
                    lineHeight: '1.35',
                    marginBottom: '10px',
                }}>
                    {node.title}
                </div>

                <div style={{
                    fontSize: '14px',
                    color: COLORS.textMuted,
                    lineHeight: '1.55',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {node.summary?.slice(0, 220)}…
                </div>

                <div style={{
                    marginTop: '14px',
                    fontSize: '18px',
                    color: hovered ? COLORS.olive : COLORS.border,
                    transition: 'color 0.2s',
                }}>
                    ↓
                </div>
            </div>
        </div>
    )
}