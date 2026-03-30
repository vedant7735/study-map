import { useState, useEffect } from 'react'
import { THEMES } from './themes'
import { getNodeAtPath, getBreadcrumb } from './utils'
import TreeScene from './TreeScene'
import RadialScene from './RadialScene'
import BloomOverlay from './BloomOverlay'

const ZOOM_IDLE = 'idle'
const ZOOM_IN = 'zoom_in'
const ZOOM_OUT = 'zoom_out'

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

/* ---------- ICONS ---------- */

const SunIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
)

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" />
    </svg>
)

/* ---------- COMPONENT ---------- */

export default function TreeViewer({ data, onReset }) {

    const [path, setPath] = useState([])
    const [zooming, setZooming] = useState(ZOOM_IDLE)
    const [zoomTarget, setZoomTarget] = useState(null)
    const [bloomed, setBloomed] = useState(null)
    const [prevPath, setPrevPath] = useState(null)
    const [viewMode, setViewMode] = useState('tree')
    const [isDark, setIsDark] = useState(false)

    const COLORS = THEMES[isDark ? 'dark' : 'light']

    const root = data.tree || data.root
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

            if (e.key === 'Escape') {
                setBloomed(null)
            }

            if (e.key === 'r' || e.key === 'R') {
                setViewMode(m => m === 'tree' ? 'radial' : 'tree')
            }
        }

        window.addEventListener('keydown', handleKey)

        return () => window.removeEventListener('keydown', handleKey)

    }, [bloomed, path, zooming])

    if (!currentNode) return null

    const children = currentNode.children || []

    const isZoomingIn = zooming === ZOOM_IN
    const isZoomingOut = zooming === ZOOM_OUT

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                background: COLORS.bg,
                overflow: 'hidden',
                fontFamily: "'Georgia', serif",
                position: 'relative',
                perspective: '1200px',
                transition: 'background 0.6s ease',
            }}
        >

            {/* ---------- BREADCRUMB BAR ---------- */}

            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    padding: '18px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: `${COLORS.bg}EB`,
                    backdropFilter: 'blur(8px)',
                    borderBottom: `1px solid ${COLORS.border}`,
                    transition: 'background 0.6s ease, border-color 0.6s ease',
                }}
            >

                {/* ---------- BREADCRUMB ---------- */}

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>

                    {breadcrumb.map((node, i) => (

                        <span key={i} style={{ display: 'flex', gap: '6px' }}>

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
                                <span style={{ color: COLORS.textMuted, fontSize: '11px' }}>
                                    ›
                                </span>
                            )}

                        </span>

                    ))}

                </div>

                {/* ---------- CONTROLS ---------- */}

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                    {/* ---------- THEME TOGGLE ---------- */}

                    <div
                        onClick={() => setIsDark(d => !d)}
                        style={{
                            width: '48px',
                            height: '26px',
                            borderRadius: '13px',
                            background: isDark ? '#1A2444' : '#E8D5A0',
                            border: `1px solid ${isDark ? '#2A3A64' : '#C4A55A'}`,
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.4s ease',
                        }}
                    >

                        <div
                            style={{
                                position: 'absolute',
                                top: '3px',
                                left: isDark ? '24px' : '3px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: isDark ? '#F0F4FF' : '#C4A55A',
                                color: isDark ? '#1A2444' : '#ffffff',
                                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isDark
                                    ? '0 0 6px rgba(240,244,255,0.4)'
                                    : '0 0 6px rgba(196,165,90,0.5)',
                            }}
                        >
                            {isDark ? <MoonIcon /> : <SunIcon />}
                        </div>

                    </div>

                    {/* ---------- VIEW MODE ---------- */}

                    <button
                        onClick={() =>
                            setViewMode(m => m === 'tree' ? 'radial' : 'tree')
                        }
                        style={{
                            ...navBtnStyle,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: '6px',
                            padding: '4px 10px',
                            color: COLORS.olive,
                            fontSize: '11px',
                            letterSpacing: '1px',
                        }}
                    >
                        {viewMode === 'tree' ? '⊙ roots' : '⊞ tree'} [r]
                    </button>

                    {path.length > 0 && (
                        <button
                            onClick={navigateBack}
                            style={{ ...navBtnStyle, color: COLORS.textMuted }}
                        >
                            [b] back
                        </button>
                    )}

                    <button
                        onClick={onReset}
                        style={{ ...navBtnStyle, color: COLORS.textMuted }}
                    >
                        close
                    </button>

                </div>

            </div>

            {/* ---------- MAIN VIEW ---------- */}

            {viewMode === 'tree' ? (

                <TreeScene
                    currentNode={currentNode}
                    path={path}
                    children={children}
                    isZoomingIn={isZoomingIn}
                    isZoomingOut={isZoomingOut}
                    zooming={zooming}
                    zoomTarget={zoomTarget}
                    navigateInto={navigateInto}
                    setBloomed={setBloomed}
                    COLORS={COLORS}
                />

            ) : (

                <RadialScene
                    root={root}
                    path={path}
                    setPath={setPath}
                    setBloomed={setBloomed}
                    COLORS={COLORS}
                />

            )}

            {/* ---------- BLOOM OVERLAY ---------- */}

            {bloomed && (
                <BloomOverlay
                    node={bloomed}
                    onClose={() => setBloomed(null)}
                    COLORS={COLORS}
                />
            )}

        </div>
    )
}