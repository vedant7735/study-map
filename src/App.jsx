import { useState, useCallback } from 'react'
import TreeViewer from './TreeViewer'

export default function App() {
  const [treeData, setTreeData] = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.ktree')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        setTreeData(data)
      } catch {
        alert('Invalid .ktree file')
      }
    }
    reader.readAsText(file)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const onFileInput = (e) => handleFile(e.target.files[0])

  if (treeData) return <TreeViewer data={treeData} onReset={() => setTreeData(null)} />

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        minHeight: '100vh',
        background: '#F5F0E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Georgia', serif",
      }}
    >
      <div style={{
        border: `2px dashed ${dragging ? '#6B7C4A' : '#C8C0B0'}`,
        borderRadius: '16px',
        padding: '80px 100px',
        textAlign: 'center',
        background: dragging ? 'rgba(107,124,74,0.05)' : 'transparent',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
        <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#2C2C2C', margin: '0 0 8px' }}>
          Study Map
        </h1>
        <p style={{ color: '#888', fontSize: '15px', margin: '0 0 32px' }}>
          Drop a .ktree file to begin
        </p>
        <label style={{
          cursor: 'pointer',
          background: '#6B7C4A',
          color: '#F5F0E8',
          padding: '12px 28px',
          borderRadius: '8px',
          fontSize: '14px',
          letterSpacing: '0.5px',
        }}>
          Browse file
          <input type="file" accept=".ktree" onChange={onFileInput} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  )
}