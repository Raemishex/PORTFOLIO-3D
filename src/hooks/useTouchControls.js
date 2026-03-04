import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { students } from '../data/students';
import useHaptic from './useHaptic';

const useTouchControls = () => {
  const activeStudentIndex = useStore((state) => state.activeStudentIndex);
  const setActiveStudentIndex = useStore((state) => state.setActiveStudentIndex);
  const navigate = useNavigate();
  const location = useLocation();
  const haptic = useHaptic();

  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });

  const minSwipeDistance = 50;

  useEffect(() => {
    let lastTap = 0;

    const onTouchStart = (e) => {
      touchStartRef.current.x = e.targetTouches[0].clientX;
      touchStartRef.current.y = e.targetTouches[0].clientY;
      touchEndRef.current.x = e.targetTouches[0].clientX; // Initialize end with start
      touchEndRef.current.y = e.targetTouches[0].clientY; // Initialize end with start
    };

    const onTouchMove = (e) => {
      touchEndRef.current.x = e.targetTouches[0].clientX;
      touchEndRef.current.y = e.targetTouches[0].clientY;
    };

    const onTouchEnd = () => {
      const diffX = touchStartRef.current.x - touchEndRef.current.x;
      const diffY = touchStartRef.current.y - touchEndRef.current.y;
      const isHome = location.pathname === '/';
      const isStudentPage = location.pathname.startsWith('/student');

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal Swipe
        if (Math.abs(diffX) > minSwipeDistance) { // threshold
          if (diffX > 0) {
            // Swiped left
            if (isHome || isStudentPage) {
              const nextIndex = (activeStudentIndex + 1) % students.length;
              setActiveStudentIndex(nextIndex);
              haptic.medium();
              if (isStudentPage) navigate(`/student/${nextIndex}`);
            }
          } else {
            // Swiped right
            if (isHome || isStudentPage) {
              const prevIndex = (activeStudentIndex - 1 + students.length) % students.length;
              setActiveStudentIndex(prevIndex);
              haptic.medium();
              if (isStudentPage) navigate(`/student/${prevIndex}`);
            }
          }
        }
      } else {
        // Vertical Swipe
        if (diffY < -minSwipeDistance) { // Swiped DOWN
           if (isStudentPage) {
             haptic.heavy();
             navigate('/');
           }
        }
      }
    };

    // Double tap to open
    const handleDoubleTap = (e) => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        if (location.pathname === '/') {
           haptic.heavy();
           navigate(`/student/${activeStudentIndex}`);
        }
      }
      lastTap = now;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchend', handleDoubleTap);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchend', handleDoubleTap);
    };
  }, [activeStudentIndex, setActiveStudentIndex, navigate, location.pathname]);
};

export default useTouchControls;
