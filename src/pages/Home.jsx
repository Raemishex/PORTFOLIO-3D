import { useState } from 'react';
import LoadingScreen from '../components/UI/LoadingScreen';
import PremiumFooter from '../components/UI/PremiumFooter';
import Overlay from '../components/UI/Overlay';
import StudentGrid from '../components/UI/StudentGrid';
import Scene from '../components/Scene3D/Scene';
import AudioManager from '../utils/AudioManager';
import useStore from '../store/useStore';
import { students } from '../data/students';
import Tutorial from '../components/UI/Tutorial';
import '../index.css';
import ParticleField from '../components/UI/ParticleField';
import '../mobile.css';

const Home = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const activeStudentIndex = useStore((state) => state.activeStudentIndex);
  const hasLoaded = useStore((state) => state.hasLoaded);
  const setHasLoaded = useStore((state) => state.setHasLoaded);

  const handleLoadingComplete = () => {
    setHasLoaded(true);
    setShowTutorial(true);
  };

  return (
    <div className="home-container" style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {!hasLoaded && <LoadingScreen onComplete={handleLoadingComplete} />}

      {hasLoaded && showTutorial && (
        <Tutorial onClose={() => setShowTutorial(false)} />
      )}

      <div
        className={`main-content ${hasLoaded ? 'visible' : ''}`}
        style={{
          opacity: hasLoaded ? 1 : 0,
          transition: 'opacity 1.5s ease',
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <AudioManager />
        <ParticleField />

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
           <Scene />
        </div>

        <Overlay student={students[activeStudentIndex]} />

        {/* Footer pinned to bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 2, pointerEvents: 'none' }}>
           <PremiumFooter />
        </div>

        <StudentGrid />
      </div>
    </div>
  );
};

export default Home;
