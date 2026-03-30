export default function RadialTooltip({ tooltip, dims, COLORS }) {
    const padding = 16
    const w = 220
    let x = tooltip.x + 20
    let y = tooltip.y - 10
    if (x + w > dims.width - padding) x = tooltip.x - w - 20
    if (y < 70) y = tooltip.y + 20

    return (
        <div style={{
            position: 'absolute',
            left: x, top: y,
            width: w,
            background: `${COLORS.surface}F7`,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '10px',
            padding: '14px 16px',
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
            zIndex: 50,
            transition: 'background 0.4s ease',
        }}>
            <div style={{
                fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                color: tooltip.node.type === 'leaf' ? COLORS.gold : COLORS.olive,
                marginBottom: '6px',
            }}>
                {tooltip.node.type === 'leaf' ? '✦ leaf' : tooltip.depth === 0 ? 'root' : 'branch'}
            </div>
            <div style={{ fontSize: '13px', color: COLORS.text, fontWeight: '600', marginBottom: '8px', lineHeight: '1.3' }}>
                {tooltip.node.title}
            </div>
            <div style={{
                fontSize: '11px', color: COLORS.textMuted, lineHeight: '1.6',
                display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                {tooltip.node.summary?.slice(0, 160)}
            </div>
        </div>
    )
}
