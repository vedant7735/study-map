import { useState, useEffect, useRef } from 'react'

const COLORS = {
    bg: '#F5F0E8',
    olive: '#6B7C4A',
    text: '#2C2C2C',
    textMuted: '#9A9080',
    border: '#E0D8CC',
    gold: '#C4A55A',
    surface: '#FAFAF7',
}

function getNodeAtPath(root, path) {
    let node = root
    for (const idx of path) {
        if (!node.children || node.children[idx] === undefined) return null
        node = node.children[idx]
    }
    return node
}

function getBreadcrumb(root, path) {
    const crumbs = [root]
    let node = root
    for (const idx of path) {
        node = node.children[idx]
        crumbs.push(node)
    }
    return crumbs
}

// Zoom states
const ZOOM_IDLE = 'idle'
const ZOOM_IN = 'zoom_in'
const ZOOM_OUT = 'zoom_out'

export default function TreeViewer({ data, onReset }) {
    const [path, setPath] = useState([])
    const [zooming, setZooming] = useState(ZOOM_IDLE)
    const [zoomTarget, setZoomTarget] = useState(null) // index of child being zoomed into
    const [bloomed, setBloomed] = useState(null) // node being bloomed
    const [prevPath, setPrevPath] = useState(null) // for zoom out animation

    const root = data.root
    const currentNode = getNodeAtPath(root, path)
    const breadcrumb = getBreadcrumb(root, path)

    const navigateInto = (childIdx) => {
        if (zooming !== ZOOM_IDLE) return
        setZoomTarget(childIdx)
        setZooming(ZOOM_IN)
        setTimeout(() => {
            setPath(prev => [...prev, childIdx])
            setZoomTarget(null)
            setZooming(ZOOM_IDLE)
        }, 600)
    }

    const navigateBack = () => {
        if (zooming !== ZOOM_IDLE || path.length === 0) return
        setPrevPath(path)
        setZooming(ZOOM_OUT)
        setTimeout(() => {
            setPath(prev => prev.slice(0, -1))
            setPrevPath(null)
            setZooming(ZOOM_IDLE)
        }, 600)
    }

    const navigateToBreadcrumb = (level) => {
        if (level >= path.length) return
        setPath(path.slice(0, level))
    }

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'b' || e.key === 'B') {
                if (bloomed) setBloomed(null)
                else navigateBack()
            }
            if (e.key === 'Escape') setBloomed(null)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [bloomed, path, zooming])

    if (!currentNode) return null

    const children = currentNode.children || []
    const isZoomingIn = zooming === ZOOM_IN
    const isZoomingOut = zooming === ZOOM_OUT

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: COLORS.bg,
            overflow: 'hidden',
            fontFamily: "'Georgia', serif",
            position: 'relative',
            perspective: '1200px',
        }}>

            {/* Breadcrumb */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '18px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(245,240,232,0.92)',
                backdropFilter: 'blur(8px)',
                borderBottom: `1px solid ${COLORS.border}`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {breadcrumb.map((node, i) => (
                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                                onClick={() => navigateToBreadcrumb(i)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: i === breadcrumb.length - 1 ? 'default' : 'pointer',
                                    color: i === breadcrumb.length - 1 ? COLORS.text : COLORS.textMuted,
                                    fontSize: '12px',
                                    fontFamily: "'Georgia', serif",
                                    padding: '2px 4px',
                                    fontWeight: i === breadcrumb.length - 1 ? '600' : '400',
                                    maxWidth: '180px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {node.title}
                            </button>
                            {i < breadcrumb.length - 1 && (
                                <span style={{ color: COLORS.textMuted, fontSize: '11px' }}>›</span>
                            )}
                        </span>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {path.length > 0 && (
                        <button onClick={navigateBack} style={navBtnStyle}>
                            [b] back
                        </button>
                    )}
                    <button onClick={onReset} style={navBtnStyle}>close</button>
                </div>
            </div>

            {/* Scene — the 3D space */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isZoomingIn
                        ? 'translateZ(300px) scale(1.15)'
                        : isZoomingOut
                            ? 'translateZ(-300px) scale(0.85)'
                            : 'translateZ(0px) scale(1)',
                    opacity: zooming !== ZOOM_IDLE ? 0 : 1,
                }}
            >
                {/* Current node title — shown above children */}
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                }}>
                    <div style={{
                        fontSize: '11px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: COLORS.textMuted,
                        marginBottom: '8px',
                    }}>
                        {path.length === 0 ? 'root' : `depth ${path.length}`}
                    </div>
                    <div style={{
                        fontSize: path.length === 0 ? '36px' : '22px',
                        color: path.length === 0 ? COLORS.text : COLORS.textMuted,
                        fontWeight: '400',
                        letterSpacing: path.length === 0 ? '-0.5px' : '0px',
                        maxWidth: '700px',
                        lineHeight: '1.2',
                    }}>
                        {currentNode.title}
                    </div>
                    {path.length === 0 && (
                        <div style={{
                            fontSize: '14px',
                            color: COLORS.textMuted,
                            marginTop: '8px',
                            fontStyle: 'italic',
                        }}>
                            {currentNode.summary?.slice(0, 80)}…
                        </div>
                    )}
                </div>

                {/* Children nodes */}
                {children.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: children.length <= 2 ? '80px' : children.length <= 4 ? '48px' : '32px',
                        padding: '0 60px',
                        maxWidth: '1100px',
                        width: '100%',
                        marginTop: path.length === 0 ? '80px' : '40px',
                    }}>
                        {children.map((child, idx) => (
                            <ChildNode
                                key={child.id}
                                node={child}
                                idx={idx}
                                total={children.length}
                                isZoomTarget={zoomTarget === idx}
                                isZoomingIn={isZoomingIn}
                                onClick={() => navigateInto(idx)}
                                onRightClick={(e) => {
                                    e.preventDefault()
                                    setBloomed(child)
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        maxWidth: '680px',
                        width: '100%',
                        padding: '0 40px',
                        marginTop: '20px',
                    }}>
                        <div style={{
                            fontSize: '11px',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            color: COLORS.gold,
                            marginBottom: '16px',
                        }}>✦ leaf node</div>
                        <h2 style={{
                            fontSize: '32px',
                            fontWeight: '400',
                            color: COLORS.text,
                            lineHeight: '1.2',
                            margin: '0 0 24px',
                        }}>
                            {currentNode.title}
                        </h2>
                        <div style={{
                            width: '40px',
                            height: '2px',
                            background: COLORS.olive,
                            marginBottom: '24px',
                        }} />
                        <p style={{
                            fontSize: '16px',
                            lineHeight: '1.85',
                            color: '#444',
                            margin: 0,
                        }}>
                            {currentNode.summary}
                        </p>
                    </div>
                )}

                {/* Hint */}
                {children.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        bottom: '28px',
                        fontSize: '11px',
                        color: COLORS.textMuted,
                        letterSpacing: '1px',
                        display: 'flex',
                        gap: '24px',
                    }}>
                        <span>click to zoom in</span>
                        <span>right click for summary</span>
                        {path.length > 0 && <span>[b] to go back</span>}
                    </div>
                )}
            </div>

            {/* Bloom overlay */}
            {bloomed && (
                <BloomOverlay node={bloomed} onClose={() => setBloomed(null)} />
            )}
        </div>
    )
}

function ChildNode({ node, idx, total, isZoomTarget, isZoomingIn, onClick, onRightClick }) {
    const [hovered, setHovered] = useState(false)
    const isLeaf = node.type === 'leaf'
    const childCount = node.children?.length || 0

    return (
        <div
            onClick={onClick}
            onContextMenu={onRightClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '48px 84px',
                borderRadius: '12px',
                border: `1px solid ${hovered ? COLORS.olive : COLORS.border}`,
                background: hovered ? 'rgba(107,124,74,0.04)' : COLORS.surface,
                transition: 'all 0.25s ease',
                transform: hovered
                    ? 'translateY(-6px) scale(1.03)'
                    : isZoomTarget && isZoomingIn
                        ? 'scale(1.2) translateZ(80px)'
                        : 'translateY(0) scale(1)',
                boxShadow: hovered
                    ? '0 12px 40px rgba(107,124,74,0.12)'
                    : '0 2px 8px rgba(0,0,0,0.04)',
                flex: total <= 3 ? '0 0 260px' : '0 0 200px',
                maxWidth: total <= 3 ? '280px' : '220px',
                minWidth: '160px',
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
    )
}

function BloomOverlay({ node, onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(245,240,232,0.97)',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 40px',
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.2s ease',
                cursor: 'pointer',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '680px',
                    width: '100%',
                    cursor: 'default',
                }}
            >
                <div style={{
                    fontSize: '11px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: node.type === 'leaf' ? COLORS.gold : COLORS.olive,
                    marginBottom: '16px',
                }}>
                    {node.type === 'leaf' ? '✦ leaf node' : 'branch node'}
                </div>
                <h1 style={{
                    fontSize: '38px',
                    fontWeight: '400',
                    color: COLORS.text,
                    lineHeight: '1.2',
                    margin: '0 0 28px',
                    letterSpacing: '-0.5px',
                }}>
                    {node.title}
                </h1>
                <div style={{
                    width: '40px',
                    height: '2px',
                    background: COLORS.olive,
                    marginBottom: '28px',
                }} />
                <p style={{
                    fontSize: '17px',
                    lineHeight: '1.85',
                    color: '#444',
                    margin: 0,
                }}>
                    {node.summary}
                </p>
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '40px',
                        background: 'none',
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: '8px',
                        padding: '10px 24px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: COLORS.textMuted,
                        fontFamily: "'Georgia', serif",
                        letterSpacing: '1px',
                    }}
                >
                    close [esc]
                </button>
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
        </div>
    )
}

const navBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888',
    fontSize: '12px',
    fontFamily: "'Georgia', serif",
    padding: '4px 8px',
    letterSpacing: '0.5px',
}