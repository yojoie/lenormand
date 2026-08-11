import { useState, useRef, useEffect, useCallback } from 'react'
import cloudImg from '../assets/image.png'

export default function CloudSelector() {
  const containerRef = useRef(null)
  const [rects, setRects] = useState([])
  const [drawing, setDrawing] = useState(null)
  const drawingRef = useRef(null)

  useEffect(() => {
    drawingRef.current = drawing
  }, [drawing])

  const getPercent = useCallback((clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    return { x, y }
  }, [])

  // window 级别的事件，确保拖出图片也能跟踪
  useEffect(() => {
    const handleMove = (e) => {
      if (!drawingRef.current) return
      const p = getPercent(e.clientX, e.clientY)
      setDrawing(d => d ? { ...d, endX: p.x, endY: p.y } : null)
    }

    const handleUp = () => {
      if (!drawingRef.current) return
      const d = drawingRef.current
      let x1 = Math.min(d.startX, d.endX)
      let y1 = Math.min(d.startY, d.endY)
      let x2 = Math.max(d.startX, d.endX)
      let y2 = Math.max(d.startY, d.endY)

      // 最小尺寸保护 3%
      const minSize = 0.03
      if (x2 - x1 < minSize) {
        const cx = (x1 + x2) / 2
        x1 = cx - minSize / 2
        x2 = cx + minSize / 2
      }
      if (y2 - y1 < minSize) {
        const cy = (y1 + y2) / 2
        y1 = cy - minSize / 2
        y2 = cy + minSize / 2
      }

      setRects(r => [...r, { id: Date.now(), x1, y1, x2, y2 }])
      setDrawing(null)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [getPercent])

  const handleMouseDown = (e) => {
    e.preventDefault()
    const p = getPercent(e.clientX, e.clientY)
    setDrawing({ startX: p.x, startY: p.y, endX: p.x, endY: p.y })
  }

  const removeRect = (id) => setRects(r => r.filter(x => x.id !== id))
  const clearAll = () => setRects([])

  const generateCode = () => {
    if (rects.length === 0) return '// 请至少框选一个区域'
    const conditions = rects.map(r => {
      return `(xPercent > ${r.x1.toFixed(3)} && xPercent < ${r.x2.toFixed(3)} && yPercent > ${r.y1.toFixed(3)} && yPercent < ${r.y2.toFixed(3)} && lightness > 70)`
    }).join(' ||\n          ')
    return `if (${conditions}) {
          data[i + 3] = 0
        }`
  }

  const [copied, setCopied] = useState(false)
  const copyCode = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#111',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      overflow: 'auto',
    }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <h3 style={{ color: '#fff', margin: 0 }}>框选要透明的区域</h3>
        <button onClick={clearAll} style={btnStyle}>清空所有</button>
        <button onClick={copyCode} style={btnStyle}>{copied ? '已复制!' : '复制代码'}</button>
        <button onClick={() => window.location.reload()} style={btnStyle}>关闭</button>
        <span style={{ color: '#aaa', fontSize: 14 }}>在图片上按住鼠标拖拽绘制矩形</span>
      </div>

      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'relative',
          width: 'fit-content',
          cursor: drawing ? 'crosshair' : 'crosshair',
          userSelect: 'none',
          border: '2px solid #333',
        }}
      >
        <img src={cloudImg} alt="" style={{ display: 'block', maxWidth: '100%', height: 'auto', pointerEvents: 'none' }} />

        {/* 已完成的选区 */}
        {rects.map(rect => (
          <div key={rect.id} style={{
            position: 'absolute',
            left: `${rect.x1 * 100}%`,
            top: `${rect.y1 * 100}%`,
            width: `${(rect.x2 - rect.x1) * 100}%`,
            height: `${(rect.y2 - rect.y1) * 100}%`,
            border: '2px dashed #ff4444',
            background: 'rgba(255, 68, 68, 0.15)',
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); removeRect(rect.id) }}
              style={{
                position: 'absolute',
                top: -12,
                right: -12,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#ff4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                lineHeight: '22px',
                textAlign: 'center',
                padding: 0,
              }}
            >×</button>
            <span style={{
              position: 'absolute',
              bottom: -18,
              left: 0,
              fontSize: 11,
              color: '#ff6666',
              whiteSpace: 'nowrap',
              background: 'rgba(0,0,0,0.7)',
              padding: '1px 4px',
              borderRadius: 3,
            }}>
              {rect.x1.toFixed(2)},{rect.y1.toFixed(2)} → {rect.x2.toFixed(2)},{rect.y2.toFixed(2)}
            </span>
          </div>
        ))}

        {/* 正在绘制的选区 */}
        {drawing && (
          <div style={{
            position: 'absolute',
            left: `${Math.min(drawing.startX, drawing.endX) * 100}%`,
            top: `${Math.min(drawing.startY, drawing.endY) * 100}%`,
            width: `${Math.abs(drawing.endX - drawing.startX) * 100}%`,
            height: `${Math.abs(drawing.endY - drawing.startY) * 100}%`,
            border: '2px dashed #44ff44',
            background: 'rgba(68, 255, 68, 0.15)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ color: '#fff', marginBottom: 8 }}>选区列表:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rects.length === 0 ? (
            <div style={{ color: '#666' }}>暂无选区</div>
          ) : (
            rects.map((r, i) => (
              <div key={r.id} style={{ color: '#aaa', fontSize: 13, display: 'flex', gap: 12, alignItems: 'center', background: '#222', padding: '6px 12px', borderRadius: 4 }}>
                <span style={{ color: '#44ff44' }}>区域 {i + 1}:</span>
                <span>x: {r.x1.toFixed(3)} - {r.x2.toFixed(3)}</span>
                <span>y: {r.y1.toFixed(3)} - {r.y2.toFixed(3)}</span>
                <button onClick={() => removeRect(r.id)} style={{ ...btnStyle, padding: '4px 10px', fontSize: 12 }}>×</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ color: '#fff', marginBottom: 8 }}>生成的代码:</div>
        <pre style={{
          background: '#0a0a0a',
          color: '#0f0',
          padding: 16,
          borderRadius: 6,
          overflow: 'auto',
          maxHeight: 300,
          fontSize: 12,
          lineHeight: 1.5,
        }}>{generateCode()}</pre>
      </div>

      <button
        onClick={() => {
          const code = generateCode()
          if (code.includes('请')) return
          navigator.clipboard.writeText(code)
          alert('代码已复制!')
        }}
        style={{ ...btnStyle, marginTop: 20, padding: '12px 24px', fontSize: 16, background: '#2a6' }}
      >
        完成并复制代码
      </button>
    </div>
  )
}

const btnStyle = {
  background: '#444',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 14,
}
