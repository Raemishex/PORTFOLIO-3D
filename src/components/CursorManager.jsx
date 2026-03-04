import { useEffect, useRef } from 'react';

const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const CursorManager = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  if (isTouchDevice()) return null;

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const onMouseOver = (e) => {
      const tag = e.target.tagName;
      const clickable = e.target.closest('a, button, [role="button"], input, .grid-item, .nav-link, .mobile-nav-link');
      if (clickable || tag === 'A' || tag === 'BUTTON') {
        ring.classList.add('hovering');
      }
    };

    const onMouseOut = () => {
      ring.classList.remove('hovering');
    };

    // Smooth ring follow
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      const rw = ring.classList.contains('hovering') ? 30 : 20;
      ring.style.transform = `translate(${ringX - rw}px, ${ringY - rw}px)`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="igloo-cursor-dot" />
      <div ref={ringRef} className="igloo-cursor-ring" />
    </>
  );
};

export default CursorManager;
