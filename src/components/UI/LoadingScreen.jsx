import React, { useRef, useEffect, useState } from 'react';
import './LoadingScreen.css';
import gsap from 'gsap';
import Lottie from 'lottie-react';
import loaderAnimation from '../../assets/lottie/loader.json';

const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);
  const progressBarRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Counter animation: 0% → 100%
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.val);
        setProgress(v);
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${v}%`;
        }
      },
    });

    // Text character reveal
    gsap.fromTo(textRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: 'expo.out' }
    );

    // Exit timeline
    const tl = gsap.timeline({
      delay: 2.8,
      onComplete: () => {
        if(onComplete) onComplete();
      }
    });

    tl.to(textRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, 0);

    tl.to('.loading-counter', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.in'
    }, 0);

    tl.to(bgRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 1,
      ease: 'power2.inOut'
    }, "-=0.8");

    tl.to(containerRef.current, {
      display: 'none',
      duration: 0.1
    });

  }, [onComplete]);

  const textChars = "FULL STACK 5".split('').map((char, index) => (
    <span key={index} style={{ display: 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <div ref={containerRef} className="loading-container">
      <div ref={bgRef} className="loading-bg"></div>
      <div className="loading-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '200px', height: '200px', marginBottom: '20px' }}>
          <Lottie animationData={loaderAnimation} loop={true} />
        </div>
        <h1 ref={textRef} className="loading-text">
          {textChars}
        </h1>

        {/* Progress counter */}
        <div className="loading-counter" style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          width: '200px'
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: '2.5rem',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '4px',
          }}>
            {progress}%
          </span>
          <div style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div ref={progressBarRef} style={{
              height: '100%',
              width: '0%',
              background: 'linear-gradient(90deg, #00ff9d, #00F0FF)',
              borderRadius: '2px',
            }} />
          </div>
        </div>

        <p className="loading-subtext">Premium • 3D • Interactive</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
