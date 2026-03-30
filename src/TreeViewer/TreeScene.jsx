import ChildNode from './ChildNode'

const ZOOM_IDLE = 'idle'

export default function TreeScene({
    currentNode, path, children,
    isZoomingIn, isZoomingOut, zooming,
    zoomTarget, navigateInto, setBloomed, COLORS
}) {
    return (
        <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isZoomingIn
                ? 'translateZ(300px) scale(1.15)'
                : isZoomingOut
                    ? 'translateZ(-300px) scale(0.85)'
                    : 'translateZ(0px) scale(1)',
            opacity: zooming !== ZOOM_IDLE ? 0 : 1,
            zIndex: 1,
        }}>
            {/* Current node title */}
            <div style={{
                position: 'absolute', top: '80px', left: '50%',
                transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none',
            }}>
                <div style={{
                    fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
                    color: COLORS.textMuted, marginBottom: '8px',
                }}>
                    {path.length === 0 ? 'root' : `depth ${path.length}`}
                </div>
                <div style={{
                    fontSize: path.length === 0 ? '36px' : '22px',
                    color: path.length === 0 ? COLORS.text : COLORS.textMuted,
                    fontWeight: '400', letterSpacing: path.length === 0 ? '-0.5px' : '0px',
                    maxWidth: '700px', lineHeight: '1.2',
                }}>
                    {currentNode.title}
                </div>
                {path.length === 0 && (
                    <div style={{ fontSize: '14px', color: COLORS.textMuted, marginTop: '8px', fontStyle: 'italic' }}>
                        {currentNode.summary?.slice(0, 80)}…
                    </div>
                )}
            </div>

            {/* Children or leaf content */}
            {children.length > 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center',
                    gap: children.length <= 2 ? '80px' : children.length <= 4 ? '48px' : '32px',
                    padding: '0 60px', maxWidth: '1100px', width: '100%',
                    marginTop: path.length === 0 ? '80px' : '40px',
                }}>
                    {children.map((child, idx) => (
                        <ChildNode
                            key={child.id}
                            node={child} idx={idx} total={children.length}
                            isZoomTarget={zoomTarget === idx}
                            isZoomingIn={isZoomingIn}
                            onClick={() => navigateInto(idx)}
                            onRightClick={(e) => { e.preventDefault(); setBloomed(child) }}
                            COLORS={COLORS}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ maxWidth: '680px', width: '100%', padding: '0 40px', marginTop: '20px' }}>
                    <div style={{
                        fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
                        color: COLORS.gold, marginBottom: '16px',
                    }}>
                        ✦ leaf node
                    </div>
                    <h2 style={{
                        fontSize: '32px', fontWeight: '400', color: COLORS.text,
                        lineHeight: '1.2', margin: '0 0 24px',
                    }}>
                        {currentNode.title}
                    </h2>
                    <div style={{ width: '40px', height: '2px', background: COLORS.olive, marginBottom: '24px' }} />
                    <div style={{ fontSize: '16px', lineHeight: '1.85', color: COLORS.text, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {currentNode.summary}
                    </div>
                </div>
            )}

            {/* Hint */}
            {children.length > 0 && (
                <div style={{
                    position: 'absolute', bottom: '28px', fontSize: '11px',
                    color: COLORS.textMuted, letterSpacing: '1px',
                    display: 'flex', gap: '24px',
                }}>
                    <span>click to zoom in</span>
                    <span>right click for summary</span>
                    {path.length > 0 && <span>[b] to go back</span>}
                </div>
            )}
        </div>
    )
}
