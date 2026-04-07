<div align="center">

<br />

<svg width="480" height="90" viewBox="0 0 480 90" xmlns="http://www.w3.org/2000/svg">
  <rect width="480" height="90" rx="12" fill="#F5F0E8"/>
  <line x1="48" y1="70" x2="48" y2="44" stroke="#6B7C4A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="48" y1="52" x2="34" y2="38" stroke="#6B7C4A" stroke-width="2" stroke-linecap="round"/>
  <line x1="48" y1="52" x2="62" y2="38" stroke="#6B7C4A" stroke-width="2" stroke-linecap="round"/>
  <line x1="34" y1="38" x2="27" y2="28" stroke="#6B7C4A" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="34" y1="38" x2="41" y2="28" stroke="#6B7C4A" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="62" y1="38" x2="55" y2="28" stroke="#6B7C4A" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="62" y1="38" x2="69" y2="28" stroke="#6B7C4A" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="48" cy="72" r="4" fill="#6B7C4A"/>
  <circle cx="48" cy="52" r="3.5" fill="#8B9E6A"/>
  <circle cx="34" cy="38" r="3" fill="#8B9E6A"/>
  <circle cx="62" cy="38" r="3" fill="#8B9E6A"/>
  <circle cx="27" cy="27" r="2.5" fill="#A8B890" opacity="0.9"/>
  <circle cx="41" cy="27" r="2.5" fill="#A8B890" opacity="0.9"/>
  <circle cx="55" cy="27" r="2.5" fill="#A8B890" opacity="0.9"/>
  <circle cx="69" cy="27" r="2.5" fill="#A8B890" opacity="0.9"/>
  <text x="98" y="46" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#2C2C2C">Study Map</text>
  <text x="100" y="66" font-family="Calibri, sans-serif" font-size="14" fill="#888888">Navigate ideas. Don't just read them.</text>
</svg>

<br />
<br />

<img src="https://img.shields.io/badge/version-0.2.0-A8B890?style=flat-square" alt="version" />
&nbsp;
<img src="https://img.shields.io/badge/status-in%20development-D4A96A?style=flat-square" alt="status" />
&nbsp;
<img src="https://img.shields.io/badge/license-MIT-8B9E6A?style=flat-square" alt="license" />
&nbsp;
<img src="https://img.shields.io/badge/built%20with-React%20%2B%20Vite-6B7C4A?style=flat-square" alt="built with" />
&nbsp;
<img src="https://img.shields.io/badge/file%20format-.ktree-2C2C2C?style=flat-square" alt="file format" />

<br />
<br />

</div>

---

## What is this

Study Map transforms topics and PDF documents into interactive, zoomable concept maps. Instead of scrolling through text, you navigate ideas spatially — zoom into a concept for depth, zoom out for context.

The core idea: spatial navigation improves how you understand and remember things. Every node in the tree carries a summary. Every node can be explored or bloomed into a full-page view. The learner decides how deep they go — the creator decides how deep the tree goes.

The data structure is a tree. The visualization is not.

---

## How it works

<div align="center">
<br />

<svg width="620" height="80" viewBox="0 0 620 80" xmlns="http://www.w3.org/2000/svg">
  <rect width="620" height="80" rx="10" fill="#FAFAF7"/>
  <rect x="20" y="18" width="110" height="44" rx="8" fill="#F5F0E8" stroke="#D4CFC4" stroke-width="1.5"/>
  <text x="75" y="36" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#2C2C2C">PDF or Topic</text>
  <text x="75" y="52" text-anchor="middle" font-family="Calibri, sans-serif" font-size="10" fill="#888">your input</text>
  <line x1="134" y1="40" x2="158" y2="40" stroke="#8B9E6A" stroke-width="2" stroke-linecap="round"/>
  <polygon points="158,36 166,40 158,44" fill="#8B9E6A"/>
  <rect x="170" y="18" width="110" height="44" rx="8" fill="#F5F0E8" stroke="#D4CFC4" stroke-width="1.5"/>
  <text x="225" y="36" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#2C2C2C">AI Pipeline</text>
  <text x="225" y="52" text-anchor="middle" font-family="Calibri, sans-serif" font-size="10" fill="#888">single API call</text>
  <line x1="284" y1="40" x2="308" y2="40" stroke="#8B9E6A" stroke-width="2" stroke-linecap="round"/>
  <polygon points="308,36 316,40 308,44" fill="#8B9E6A"/>
  <rect x="320" y="18" width="110" height="44" rx="8" fill="#6B7C4A"/>
  <text x="375" y="36" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#FAFAF7">.ktree file</text>
  <text x="375" y="52" text-anchor="middle" font-family="Calibri, sans-serif" font-size="10" fill="#D4CFC4">your knowledge</text>
  <line x1="434" y1="40" x2="458" y2="40" stroke="#8B9E6A" stroke-width="2" stroke-linecap="round"/>
  <polygon points="458,36 466,40 458,44" fill="#8B9E6A"/>
  <rect x="470" y="18" width="130" height="44" rx="8" fill="#F5F0E8" stroke="#D4CFC4" stroke-width="1.5"/>
  <text x="535" y="36" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="#2C2C2C">Study Map</text>
  <text x="535" y="52" text-anchor="middle" font-family="Calibri, sans-serif" font-size="10" fill="#888">navigate + explore</text>
</svg>

<br />
<br />
</div>

The AI reads your PDF or topic in a single call and writes a structured `.ktree` file. The viewer opens that file and renders the interactive map. No backend. No database. The file system is the backend.

---

## The .ktree format

`.ktree` is a portable JSON file with a fixed schema. It is the contract between the AI and the viewer. Share one like you'd share a PDF.

```json
{
  "version": "1.0",
  "title": "Computer Networks",
  "description": "Full syllabus tree for CCN",
  "tree": {
    "id": "0.0.0.0.0.0.0.0",
    "title": "Computer Networks",
    "type": "branch",
    "summary": "A study of how computers communicate...",
    "children": [...]
  }
}
```

### Node ID system

Every node has a fixed 8-segment ID. **Segment 0 is the subtree size** — the total number of descendant nodes under this node (direct children only, not recursive). Segments 1–7 encode the path. Unused path segments are padded with `0`.

```
SUBTREE_SIZE . SEG1 . SEG2 . SEG3 . SEG4 . SEG5 . SEG6 . SEG7

      27     .  1  .  1  .  3  .  2  .  0  .  0  .  0
      └─ 27 nodes in this subtree        └─ path: 1.1.3.2
```

**Why subtree size in segment 0?** The viewer uses it at render time to size nodes dynamically — nodes with larger subtrees appear bigger and are positioned further from the root. This is O(1) at render time (just parse `id.split('.')[0]`), avoiding any tree traversal.

| Node ID | Subtree size | Path |
|---------|-------------|------|
| `0.0.0.0.0.0.0.0` | 0 | Root node (leaf or single) |
| `3.1.0.0.0.0.0.0` | 3 | Path: 1 |
| `27.1.1.3.2.0.0.0` | 27 | Path: 1.1.3.2 |
| `1.1.1.3.2.1.1.0` | 1 | Path: 1.1.3.2.1.1 |

**ID rules:**
- All IDs are exactly 8 segments, always
- Segment 0 = total number of direct children (`node.children.length`), or `0` for leaf nodes
- First zero in segments 1–7 marks the path boundary
- All children of a node share the same ID prefix — easy subtree operations
- Segment 0 is a free signal to the AI about local complexity: `0` means leaf, higher means branch

---

## Views

Study Map has two rendering modes for the same `.ktree` file, toggled with `[r]`:

**Tree view** — discrete zoom navigation. Click a node to zoom in, `[b]` to go back. Best for deep hierarchical subjects where you want to follow one branch at a time.

**Roots view** — radial SVG layout. The root node sits at the centre, branches radiate outward like roots from a felled tree trunk. Node size and distance from centre scale with direct children count — heavier nodes appear larger and further out. Best for broad subjects where you need to survey everything at once.

Both views share the same navigation state — your position carries over when you toggle.

---

## Interactions

| Action | Tree view | Roots view |
|--------|-----------|------------|
| Navigate into node | click | click |
| Node summary | right click | right click |
| Go back | `[b]` | `[b]` |
| Toggle view | `[r]` | `[r]` |
| Close bloom overlay | `[esc]` | `[esc]` |

---

## Product split

|  | Viewer | Editor |
|---|---|---|
| Open `.ktree` files | ✓ | ✓ |
| Tree view + Roots view | ✓ | ✓ |
| Node bloom | ✓ | ✓ |
| Breadcrumb navigation | ✓ | ✓ |
| Chatbot | — | ✓ |
| AI tree generation | — | ✓ |
| PDF input | — | ✓ |
| Branch expand | — | ✓ |
| Runs offline | ✓ | partial |
| Install required | no (web) | yes (desktop) |

The **Viewer** is a web app — drag and drop a `.ktree` file, no install. The **Editor** will be a Tauri desktop app with filesystem and API access.

---

## Getting started

**Prerequisites:** Node.js v18+

```bash
git clone https://github.com/vedant7735/study-map
cd study-map
npm install
npm run dev
```

Open `localhost:5173`, drag in a `.ktree` file.

---

## Project structure

```
study-map/
├── src/
│   ├── App.jsx            # file loader, drag and drop
│   ├── TreeViewer.jsx     # tree view + roots view, bloom, navigation
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

---

## Tree structure rules

- **Depth:** minimum 3, maximum 7 levels
- **Width:** 2–6 children per node
- **Every node** has a summary — branches and leaves alike
- **Leaves** have no children — their summary is the full content
- The AI decides depth per branch based on topic complexity

---

## AI pipeline *(Phase 2)*

No backend. API calls go directly from the Tauri desktop app.

```
PDF / Topic  →  large context model  →  .ktree file  →  Viewer
```

The AI has one job: write valid `.ktree` JSON. The chatbot receives the full `.ktree` as context — no vector database needed, the file fits entirely in a model's context window.

---

## Roadmap

**Phase 1 — Viewer**
- [x] Lock `.ktree` schema
- [x] Hand-craft sample tree — Computer Networks, 71 nodes, 4 units
- [x] Spatial zoom viewer with 3D navigation
- [x] Node bloom on right click
- [x] Leaf node full summary view
- [x] Breadcrumb navigation with jump
- [x] Roots view — radial layout with dynamic node sizing
- [x] Toggle between Tree and Roots view (`[r]`)
- [ ] Scroll wheel to trigger zoom
- [ ] Smooth fly-through 3D animation
- [ ] Depth chain indicator

**Phase 2 — Editor + AI**
- [ ] Tauri desktop scaffold
- [ ] AI tree generation from topic or PDF
- [ ] Branch expand tool
- [ ] Leaf regenerate tool

**Phase 3 — Post-MVP**
- [ ] Per-node chatbot
- [ ] Shareable `.ktree` files
- [ ] Mobile support

---

## License

MIT