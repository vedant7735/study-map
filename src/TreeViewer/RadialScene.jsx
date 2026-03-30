import { useState, useEffect, useRef } from 'react'
import { getNodeAtPath, buildRadialLayout, findPathToNode } from './utils'
import RadialTooltip from './RadialTooltip'

export default function RadialScene({ root, path, setPath, setBloomed, COLORS }) {
    const containerRef = useRef(null)
    const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight })
    const [hoveredId, setHoveredId] = useState(null)
    const [tooltip, setTooltip] = useState(null)

    useEffect(() => {
        const obs = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            setDims({ width, height })
        })
        if (containerRef.current) obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    const currentRoot = getNodeAtPath(root, path)
    const { nodes, links } = buildRadialLayout(currentRoot, dims.width, dims.height)

    const handleNodeClick = (radialNode) => {
        if (radialNode.depth === 0) return
        const newPath = findPathToNode(currentRoot, radialNode.node)
        if (newPath) setPath(prev => [...prev, ...newPath])
    }

    const handleNodeRightClick = (e, radialNode) => {
        e.preventDefault()
        setBloomed(radialNode.node)
    }

    return (
        <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <svg width={dims.width} height={dims.height} style={{ position: 'absolute', inset: 0 }}>
                {/* Links */}
                {links.map((link, i) => (
                    <line
                        key={i}
                        x1={link.fromX} y1={link.fromY}
                        x2={link.toX} y2={link.toY}
                        stroke={COLORS.border}
                        strokeWidth={1.5}
                        opacity={0.7}
                    />
                ))}

                {/* Nodes */}
                {nodes.map((rn) => {
                    const isRoot = rn.depth === 0
                    const isLeaf = rn.node.type === 'leaf'
                    const isHovered = hoveredId === rn.id
                    const childCount = rn.node.children?.length || 0
                    const r = isRoot ? 72 : Math.max(14, 18 + rn.depth * 8 + childCount * 2)

                    return (
                        <g
                            key={rn.id}
                            transform={`translate(${rn.x}, ${rn.y})`}
                            style={{ cursor: isRoot ? 'default' : 'pointer' }}
                            onClick={() => handleNodeClick(rn)}
                            onContextMenu={(e) => handleNodeRightClick(e, rn)}
                            onMouseEnter={() => {
                                setHoveredId(rn.id)
                                setTooltip({ x: rn.x, y: rn.y, node: rn.node, depth: rn.depth })
                            }}
                            onMouseLeave={() => {
                                setHoveredId(null)
                                setTooltip(null)
                            }}
                        >
                            <circle
                                r={isHovered ? r + 4 : r}
                                fill={isRoot ? COLORS.olive : isLeaf ? `${COLORS.gold}26` : COLORS.surface}
                                stroke={isRoot ? COLORS.olive : isLeaf ? COLORS.gold : isHovered ? COLORS.olive : COLORS.border}
                                strokeWidth={isHovered ? 2 : 1}
                                style={{ transition: 'all 0.2s ease' }}
                            />
                            <foreignObject
                                x={-r + 4} y={-r + 4}
                                width={(r - 4) * 2} height={(r - 4) * 2}
                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                                    width: '100%', height: '100%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    textAlign: 'center',
                                    fontSize: isRoot ? '13px' : `${Math.max(7, r * 0.28)}px`,
                                    fontFamily: "'Georgia', serif",
                                    color: isRoot ? COLORS.surface : isLeaf ? COLORS.gold : COLORS.text,
                                    lineHeight: '1.2',
                                    overflow: 'hidden',
                                    wordBreak: 'break-word',
                                    padding: '2px',
                                }}>
                                    {rn.node.title}
                                </div>
                            </foreignObject>
                        </g>
                    )
                })}
            </svg>

            {tooltip && <RadialTooltip tooltip={tooltip} dims={dims} COLORS={COLORS} />}

            {/* Hint */}
            <div style={{
                position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
                fontSize: '11px', color: COLORS.textMuted, letterSpacing: '1px',
                display: 'flex', gap: '24px',
            }}>
                <span>click to zoom in</span>
                <span>right click for summary</span>
            </div>
        </div>
    )
}
