export function getNodeAtPath(root, path) {
    let node = root
    for (const idx of path) {
        if (!node.children || node.children[idx] === undefined) return null
        node = node.children[idx]
    }
    return node
}

export function getBreadcrumb(root, path) {
    const crumbs = [root]
    let node = root
    for (const idx of path) {
        node = node.children[idx]
        crumbs.push(node)
    }
    return crumbs
}

export function findPathToNode(root, target) {
    if (root === target) return []
    if (!root.children) return null
    for (let i = 0; i < root.children.length; i++) {
        const result = findPathToNode(root.children[i], target)
        if (result !== null) return [i, ...result]
    }
    return null
}

// ─── Radial Layout: force-directed depth-1, local radial clusters for depth-2+ ─

export function buildRadialLayout(root, width, height) {
    const cx = width / 2
    const cy = height / 2
    const nodes = []
    const links = []
    let idCounter = 0

    const depth1Children = root.children || []
    const n1 = depth1Children.length

    // --- Place root ---
    const rootId = `n${idCounter++}`
    nodes.push({ id: rootId, node: root, x: cx, y: cy, depth: 0 })

    if (n1 === 0) return { nodes, links, cx, cy }

    // --- Scatter depth-1 nodes using repulsion simulation ---
    const ellipseRx = width * 0.36
    const ellipseRy = height * 0.34
    const d1Positions = depth1Children.map((_, i) => {
        const angle = (i / n1) * Math.PI * 2 - Math.PI / 2
        return {
            x: cx + ellipseRx * Math.cos(angle),
            y: cy + ellipseRy * Math.sin(angle),
        }
    })

    const REPULSION = 18000
    const ITERATIONS = 80
    for (let iter = 0; iter < ITERATIONS; iter++) {
        for (let i = 0; i < n1; i++) {
            let fx = 0, fy = 0
            for (let j = 0; j < n1; j++) {
                if (i === j) continue
                const dx = d1Positions[i].x - d1Positions[j].x
                const dy = d1Positions[i].y - d1Positions[j].y
                const dist = Math.sqrt(dx * dx + dy * dy) || 1
                const force = REPULSION / (dist * dist)
                fx += (dx / dist) * force
                fy += (dy / dist) * force
            }
            // Spring back toward ellipse anchor
            const angle = (i / n1) * Math.PI * 2 - Math.PI / 2
            const ex = cx + ellipseRx * Math.cos(angle)
            const ey = cy + ellipseRy * Math.sin(angle)
            fx += (ex - d1Positions[i].x) * 0.12
            fy += (ey - d1Positions[i].y) * 0.12

            d1Positions[i].x += fx * 0.01
            d1Positions[i].y += fy * 0.01

            const pad = 100
            d1Positions[i].x = Math.max(pad, Math.min(width - pad, d1Positions[i].x))
            d1Positions[i].y = Math.max(pad + 60, Math.min(height - pad, d1Positions[i].y))
        }
    }

    // --- Place depth-1 nodes + their children as local radial clusters ---
    depth1Children.forEach((d1Node, i) => {
        const { x: d1x, y: d1y } = d1Positions[i]
        const d1Id = `n${idCounter++}`

        nodes.push({ id: d1Id, node: d1Node, x: d1x, y: d1y, depth: 1 })
        links.push({ fromX: cx, fromY: cy, toX: d1x, toY: d1y })

        const d2Children = d1Node.children || []
        if (d2Children.length === 0) return

        const awayAngle = Math.atan2(d1y - cy, d1x - cx)
        const spreadAngle = Math.min(Math.PI * 1.4, (Math.PI * 2) / Math.max(n1 - 1, 1) * 0.85)
        const clusterRadius = Math.min(width, height) * 0.14 + d2Children.length * 6

        d2Children.forEach((d2Node, j) => {
            const angleOffset = d2Children.length === 1
                ? 0
                : -spreadAngle / 2 + (j / (d2Children.length - 1)) * spreadAngle
            const angle = awayAngle + angleOffset
            const d2x = Math.max(60, Math.min(width - 60, d1x + clusterRadius * Math.cos(angle)))
            const d2y = Math.max(80, Math.min(height - 60, d1y + clusterRadius * Math.sin(angle)))

            const d2Id = `n${idCounter++}`
            nodes.push({ id: d2Id, node: d2Node, x: d2x, y: d2y, depth: 2 })
            links.push({ fromX: d1x, fromY: d1y, toX: d2x, toY: d2y })

            // depth-3 if any
            const d3Children = d2Node.children || []
            if (d3Children.length === 0) return

            const awayAngle3 = Math.atan2(d2y - d1y, d2x - d1x)
            const clusterRadius3 = Math.min(width, height) * 0.08
            d3Children.forEach((d3Node, k) => {
                const spread3 = Math.PI * 0.9
                const aOff3 = d3Children.length === 1 ? 0 : -spread3 / 2 + (k / (d3Children.length - 1)) * spread3
                const a3 = awayAngle3 + aOff3
                const d3x = Math.max(50, Math.min(width - 50, d2x + clusterRadius3 * Math.cos(a3)))
                const d3y = Math.max(70, Math.min(height - 50, d2y + clusterRadius3 * Math.sin(a3)))
                const d3Id = `n${idCounter++}`
                nodes.push({ id: d3Id, node: d3Node, x: d3x, y: d3y, depth: 3 })
                links.push({ fromX: d2x, fromY: d2y, toX: d3x, toY: d3y })
            })
        })
    })

    return { nodes, links, cx, cy }
}
