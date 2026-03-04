import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useStore from './store/useStore';
import Header from './components/UI/Header';
import useKeyboardMouse from './hooks/useKeyboardMouse';
import useTouchControls from './hooks/useTouchControls';
import Home from './pages/Home';
import { PortfolioProvider } from './context/PortfolioContext';
import ErrorBoundary from './components/ErrorBoundary';
import CursorManager from './components/CursorManager';
import LockoutOverlay from './components/UI/LockoutOverlay';
import SecretVideoModal from './components/UI/SecretVideoModal';
import KeyboardShortcuts from './components/UI/KeyboardShortcuts';
import ThemeTransition from './components/UI/ThemeTransition';
import NoiseOverlay from './components/UI/NoiseOverlay';
import CursorTrail from './components/UI/CursorTrail';
import ConfettiBurst from './components/UI/ConfettiBurst';
import MiniGame from './components/UI/MiniGame';
import Chatbot from './components/UI/Chatbot';
import AchievementSystem from './components/UI/AchievementSystem';
import { AchievementPanel } from './components/UI/AchievementSystem';
import InteractiveGuide from './components/UI/InteractiveGuide';
import ThemeCreator from './components/UI/ThemeCreator';
import ScreenshotShare from './components/UI/ScreenshotShare';
import AnimatedSVGBackground from './components/UI/AnimatedSVGBackground';
import FloatingToolbar from './components/UI/FloatingToolbar';
import GameCenter from './components/UI/GameCenter';
import CanvasFireworks from './components/UI/CanvasFireworks';

// Lazy loaded routes for code splitting
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const StudentDetails = lazy(() => import('./pages/StudentDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageFallback = () => (
  <div style={{
    width: '100vw', height: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-color)'
  }}>
    <div style={{
      width: '40px', height: '40px',
      border: '3px solid var(--glass-border)',
      borderTop: '3px solid var(--neon-green)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student/:slug" element={<StudentDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const theme = useStore((state) => state.theme);
  const [guideOpen, setGuideOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [themeCreatorOpen, setThemeCreatorOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [gameCenterOpen, setGameCenterOpen] = useState(false);
  const [fireworksOpen, setFireworksOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useKeyboardMouse();
  useTouchControls();

  return (
    <div className="app-container">
      <CursorManager />
      <AnimatedSVGBackground />
      <Header onOpenGames={() => setGameCenterOpen(true)} />
      <SecretVideoModal />
      <KeyboardShortcuts />
      <ThemeTransition />
      <NoiseOverlay />
      <CursorTrail />
      <ConfettiBurst />
      <MiniGame />
      <Chatbot />
      <AchievementSystem />
      <AnimatedRoutes />

      {/* Modals */}
      <InteractiveGuide isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      <AchievementPanel isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <ThemeCreator isOpen={themeCreatorOpen} onClose={() => setThemeCreatorOpen(false)} />
      <ScreenshotShare isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <GameCenter isOpen={gameCenterOpen} onClose={() => setGameCenterOpen(false)} />
      {fireworksOpen && <CanvasFireworks onClose={() => setFireworksOpen(false)} />}

      {/* Floating Toolbar */}
      <FloatingToolbar
        onGuide={() => setGuideOpen(true)}
        onAchievements={() => setAchievementsOpen(true)}
        onThemeCreator={() => setThemeCreatorOpen(true)}
        onShare={() => setShareOpen(true)}
        onFireworks={() => setFireworksOpen(prev => !prev)}
      />
    </div>
  );
};

function App() {
  const bannedUntil = localStorage.getItem('banned_until');
  const isBanned = bannedUntil && parseInt(bannedUntil) > Date.now();

  if (isBanned) {
    return <LockoutOverlay />;
  }

  if (bannedUntil && parseInt(bannedUntil) <= Date.now()) {
    localStorage.removeItem('banned_until');
  }

  return (
    <ErrorBoundary>
      <PortfolioProvider>
        <Router>
          <AppContent />
        </Router>
      </PortfolioProvider>
    </ErrorBoundary>
  );
}

export default App;
