import { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = ['#e8e4de', '#c8ff00', '#ff3c3c', '#00b4ff', '#b44aff', '#ff6b35', '#00ff9d', '#ff6b9d'];
const SIZES = [2, 4, 8, 16, 32];

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#e8e4de');
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState('pen'); // pen | eraser
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.fillStyle = '#0a0a08';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  const draw = useCallback((pos) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = tool === 'eraser' ? '#0a0a08' : color;

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    lastPos.current = pos;
  }, [color, size, tool]);

  const handleStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    draw(getPos(e));
  };

  const handleEnd = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a08';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `fs5-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
        flexWrap: 'wrap',
      }}>
        {/* Colors */}
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool('pen'); }}
            style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: c, border: color === c && tool === 'pen' ? '2px solid #fff' : '2px solid transparent',
              cursor: 'none', flexShrink: 0,
            }}
          />
        ))}

        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 4px' }} />

        {/* Eraser */}
        <button
          onClick={() => setTool(tool === 'eraser' ? 'pen' : 'eraser')}
          style={{
            padding: '4px 10px', borderRadius: '6px', cursor: 'none',
            background: tool === 'eraser' ? 'rgba(255,255,255,0.15)' : 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-main)',
            letterSpacing: '1px',
          }}
        >
          {tool === 'eraser' ? '✏️' : '🧹'}
        </button>

        {/* Size */}
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{
            padding: '4px 8px', borderRadius: '6px', cursor: 'none',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          }}
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <div style={{ flex: 1 }} />

        <button onClick={clearCanvas} style={{
          padding: '4px 10px', borderRadius: '6px', cursor: 'none',
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '1px',
        }}>
          CLEAR
        </button>
        <button onClick={saveCanvas} style={{
          padding: '4px 10px', borderRadius: '6px', cursor: 'none',
          background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
          fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--neon-green)', letterSpacing: '1px',
        }}>
          SAVE
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          width: '100%',
          height: '300px',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />
    </div>
  );
};

export default DrawingCanvas;
