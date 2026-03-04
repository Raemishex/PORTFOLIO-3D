import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TextReveal = ({ text, tag = 'h1', className = '', style = {}, delay = 0 }) => {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !containerRef.current) return;
    hasAnimated.current = true;

    const chars = containerRef.current.querySelectorAll('.text-reveal-char');
    gsap.set(chars, { y: '100%', opacity: 0 });

    gsap.to(chars, {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power4.out',
      delay,
    });
  }, [delay]);

  const Tag = tag;
  const words = text.split(' ');

  return (
    <Tag ref={containerRef} className={className} style={{ ...style, overflow: 'hidden' }}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', marginRight: '0.3em', overflow: 'hidden' }}>
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className="text-reveal-char"
              style={{ display: 'inline-block', willChange: 'transform' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
