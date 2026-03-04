import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { students } from '../data/students';

const useKeyboardMouse = () => {
  const activeStudentIndex = useStore((state) => state.activeStudentIndex);
  const setActiveStudentIndex = useStore((state) => state.setActiveStudentIndex);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isHome = location.pathname === '/';
      const isStudentPage = location.pathname.startsWith('/student');

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
         // Left/Right is reserved for 3D interactions on Student Page
         if (isHome) {
           const dir = e.key === 'ArrowRight' ? 1 : -1;
           const newIndex = (activeStudentIndex + dir + students.length) % students.length;
           setActiveStudentIndex(newIndex);
         }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
         if (isHome || isStudentPage) {
           // Prevent default scrolling to ensure page doesn't jump wildly during transition
           e.preventDefault();
           const dir = e.key === 'ArrowDown' ? 1 : -1;
           const newIndex = (activeStudentIndex + dir + students.length) % students.length;
           setActiveStudentIndex(newIndex);
           if (isStudentPage) navigate(`/student/${newIndex}`);
         }
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (isHome) navigate(`/student/${activeStudentIndex}`);
      } else if (e.key === 'Escape') {
        if (isStudentPage || location.pathname !== '/') {
           navigate('/');
        }
      }
    };

    // Very basic mouse wheel fallback for vertical swiping
    const handleWheel = (e) => {
      // Basic debounce for wheel
      if (document.body.style.pointerEvents === 'none') return;
      
      const isHome = location.pathname === '/';
      const isStudentPage = location.pathname.startsWith('/student');

      if (isHome || isStudentPage) {
        if (e.deltaY > 50) {
           // Scroll down -> Next student
           const nextIndex = (activeStudentIndex + 1) % students.length;
           setActiveStudentIndex(nextIndex);
           if (isStudentPage) navigate(`/student/${nextIndex}`);
           temporarilyDisableWheel();
        } else if (e.deltaY < -50) {
           // Scroll up -> Prev student
           const prevIndex = (activeStudentIndex - 1 + students.length) % students.length;
           setActiveStudentIndex(prevIndex);
           if (isStudentPage) navigate(`/student/${prevIndex}`);
           temporarilyDisableWheel();
        }
      }
    };

    const temporarilyDisableWheel = () => {
      document.body.style.pointerEvents = 'none';
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 800);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeStudentIndex, setActiveStudentIndex, location.pathname, navigate]);
};

export default useKeyboardMouse;
