import { useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { students } from '../data/students';
import i18n from '../i18n';
import { unlockAchievement } from '../components/UI/AchievementSystem';

// Configuration
const SWIPE_THRESHOLD = 0.08; // Minimum wrist displacement to count as swipe
const SWIPE_COOLDOWN = 1200; // ms between swipe actions
const GESTURE_COOLDOWN = 1500; // ms between static gesture actions
const SWIPE_HISTORY_LENGTH = 6; // frames to accumulate for swipe detection
const PENALTY_FRAMES_REQUIRED = 15;
const EASTER_EGG_FRAMES_REQUIRED = 18;
const PINCH_THRESHOLD = 0.04; // Distance between thumb and index for pinch

// MediaPipe hand connection indices for visualization
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

const useGestureControl = () => {
  const setCameraPermission = useStore((state) => state.setCameraPermission);
  const navigate = useNavigate();
  const location = useLocation();

  // Store navigate/location in refs so the rAF loop always has fresh values
  const navigateRef = useRef(navigate);
  const locationRef = useRef(location);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);
  useEffect(() => { locationRef.current = location; }, [location]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognizerRef = useRef(null);
  const requestRef = useRef(null);
  const predictWebcamRef = useRef(null);

  const lastGestureTimeRef = useRef(0);
  const lastSwipeTimeRef = useRef(0);

  // Use a position history buffer instead of single previous frame
  const wristHistoryRef = useRef([]);

  const middleFingerFramesRef = useRef(0);
  const figGestureFramesRef = useRef(0);

  // --- Drawing helper ---
  const drawHandVisualization = useCallback((landmarks, canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.5)';
    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    });

    ctx.fillStyle = '#00F0FF';
    landmarks.forEach((lm) => {
      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, []);

  // --- Swipe detection from accumulated history ---
  const detectSwipe = useCallback(() => {
    const history = wristHistoryRef.current;
    if (history.length < SWIPE_HISTORY_LENGTH) return null;

    const first = history[0];
    const last = history[history.length - 1];
    const deltaX = last.x - first.x;
    const deltaY = last.y - first.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD && Math.abs(deltaY) < SWIPE_THRESHOLD) {
      return null;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX < 0 ? 'SWIPE_LEFT' : 'SWIPE_RIGHT';
    } else {
      return deltaY < 0 ? 'SWIPE_UP' : 'SWIPE_DOWN';
    }
  }, []);

  // --- Process gestures on each frame ---
  const processFrame = useCallback((results) => {
    if (!results.landmarks || results.landmarks.length === 0) {
      // No hand detected
      const canvas = document.getElementById('mediapipe-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      wristHistoryRef.current = [];
      middleFingerFramesRef.current = 0;
      figGestureFramesRef.current = 0;
      useStore.getState().setHandCoordinates(null);
      return;
    }

    const landmarks = results.landmarks[0];
    const canvas = document.getElementById('mediapipe-canvas');

    // 1. Visualization
    drawHandVisualization(landmarks, canvas);

    // 2. Index finger tracking for virtual cursor
    useStore.getState().setHandCoordinates({
      x: 1 - landmarks[8].x,
      y: landmarks[8].y
    });

    // 3. Penalty gesture: middle finger detection
    const isIndexDown = landmarks[8].y > landmarks[6].y;
    const isMiddleUp = landmarks[12].y < landmarks[10].y;
    const isRingDown = landmarks[16].y > landmarks[14].y;
    const isPinkyDown = landmarks[20].y > landmarks[18].y;
    const isMiddleHighest = landmarks[12].y < landmarks[8].y - 0.05 && landmarks[12].y < landmarks[16].y - 0.05;

    if (isIndexDown && isMiddleUp && isRingDown && isPinkyDown && isMiddleHighest) {
      middleFingerFramesRef.current += 1;
      if (middleFingerFramesRef.current >= PENALTY_FRAMES_REQUIRED) {
        const banTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('banned_until', banTime.toString());
        if (videoRef.current) videoRef.current.pause();
        window.location.reload();
        return;
      }
    } else {
      middleFingerFramesRef.current = 0;
    }

    // 4. Easter egg: fig gesture
    const thumbX = landmarks[4].x;
    const indexMCPX = landmarks[5].x;
    const middleMCPX = landmarks[9].x;
    const isThumbTucked = thumbX > Math.min(indexMCPX, middleMCPX) && thumbX < Math.max(indexMCPX, middleMCPX);
    const allCurled = landmarks[8].y > landmarks[6].y &&
                      landmarks[12].y > landmarks[10].y &&
                      landmarks[16].y > landmarks[14].y &&
                      landmarks[20].y > landmarks[18].y;

    if (isThumbTucked && allCurled) {
      figGestureFramesRef.current += 1;
      if (figGestureFramesRef.current >= EASTER_EGG_FRAMES_REQUIRED) {
        if (!useStore.getState().isSecretVideoOpen) {
          useStore.getState().setSecretVideoOpen(true);
          figGestureFramesRef.current = 0;
        }
      }
    } else {
      figGestureFramesRef.current = 0;
    }

    // 5. Finger counting for UI feedback
    const isIndexUp = landmarks[8].y < landmarks[6].y;
    const isMiddleExtended = landmarks[12].y < landmarks[10].y;
    const isRingUp = landmarks[16].y < landmarks[14].y;
    const isPinkyUp = landmarks[20].y < landmarks[18].y;
    const isThumbUp = landmarks[4].x < landmarks[3].x; // For right hand
    const extendedFingers = [isThumbUp, isIndexUp, isMiddleExtended, isRingUp, isPinkyUp].filter(Boolean).length;
    useStore.getState().setFingerCount(extendedFingers);

    // 6. Pinch detection (thumb tip to index tip distance)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const pinchDist = Math.sqrt(
      (thumbTip.x - indexTip.x) ** 2 + (thumbTip.y - indexTip.y) ** 2
    );
    const nowPinching = pinchDist < PINCH_THRESHOLD;
    useStore.getState().setIsPinching(nowPinching);

    // Pinch zoom: calculate zoom based on thumb-pinky distance
    const pinkyTip = landmarks[20];
    const handSpan = Math.sqrt(
      (thumbTip.x - pinkyTip.x) ** 2 + (thumbTip.y - pinkyTip.y) ** 2
    );
    const zoom = Math.min(Math.max(handSpan * 5, 0.5), 2.0);
    useStore.getState().setGestureZoom(zoom);

    // 7. Hand rotation tracking
    const wristLm = landmarks[0];
    const middleMCP = landmarks[9];
    const angle = Math.atan2(middleMCP.y - wristLm.y, middleMCP.x - wristLm.x) * (180 / Math.PI);
    useStore.getState().setHandRotation(angle);

    // 8. Static gestures from MediaPipe recognizer
    const nowPerf = performance.now();
    if (results.gestures && results.gestures.length > 0) {
      const { categoryName, score } = results.gestures[0][0];
      const state = useStore.getState();
      const pathname = locationRef.current.pathname;

      if (score > 0.7 && nowPerf - lastGestureTimeRef.current > GESTURE_COOLDOWN) {
        let gestureHandled = false;

        // Thumb Up → Toggle audio
        if (categoryName === 'Thumb_Up') {
          state.setPlaying(!state.isPlaying);
          state.setGestureFeedback(i18n.t('gestures.audio_toggled', 'Audio Toggled!'));
          gestureHandled = true;
        }

        // Closed Fist → Open profile (from home)
        if (categoryName === 'Closed_Fist' && pathname === '/') {
          state.setGestureFeedback(i18n.t('gestures.zooming_in', 'Opening Profile...'));
          navigateRef.current(`/student/${state.activeStudentIndex}`);
          gestureHandled = true;
        }

        // Open Palm → Close profile / Go home (from any page)
        if (categoryName === 'Open_Palm' && pathname !== '/') {
          state.setGestureFeedback(i18n.t('gestures.zooming_out', 'Closing Profile...'));
          navigateRef.current('/');
          gestureHandled = true;
        }

        // Victory / Peace sign → Toggle language
        if (categoryName === 'Victory') {
          const newLang = i18n.language === 'en' ? 'az' : 'en';
          i18n.changeLanguage(newLang);
          state.setGestureFeedback(i18n.t('gestures.language_switched', `Language: ${newLang.toUpperCase()}`));
          gestureHandled = true;
        }

        // Pointing Up → Toggle theme
        if (categoryName === 'Pointing_Up') {
          state.toggleTheme();
          state.setGestureFeedback(i18n.t('gestures.theme_toggled', 'Theme Changed!'));
          gestureHandled = true;
        }

        // ILoveYou → Navigate to About page
        if (categoryName === 'ILY' && pathname !== '/about') {
          state.setGestureFeedback(i18n.t('gestures.navigating_about', 'Going to About...'));
          navigateRef.current('/about');
          gestureHandled = true;
        }

        // Thumb Down → Navigate to Contact page
        if (categoryName === 'Thumb_Down' && pathname !== '/contact') {
          state.setGestureFeedback(i18n.t('gestures.navigating_contact', 'Going to Contact...'));
          navigateRef.current('/contact');
          gestureHandled = true;
        }

        if (gestureHandled) {
          lastGestureTimeRef.current = nowPerf;
          unlockAchievement('use_gesture');
        }
      }
    }

    // 6. Swipe detection from wrist position history
    const wrist = landmarks[0];
    wristHistoryRef.current.push({ x: wrist.x, y: wrist.y });
    if (wristHistoryRef.current.length > SWIPE_HISTORY_LENGTH) {
      wristHistoryRef.current.shift();
    }

    if (nowPerf - lastSwipeTimeRef.current > SWIPE_COOLDOWN) {
      const swipe = detectSwipe();
      if (swipe) {
        const state = useStore.getState();
        const pathname = locationRef.current.pathname;
        const isHome = pathname === '/';
        const isStudentPage = pathname.startsWith('/student');

        let handled = false;

        if (swipe === 'SWIPE_LEFT' && (isHome || isStudentPage)) {
          const nextIndex = (state.activeStudentIndex + 1) % students.length;
          state.setActiveStudentIndex(nextIndex);
          state.setGestureFeedback(i18n.t('gestures.swipe_left', 'Swiping Left...'));
          if (isStudentPage) navigateRef.current(`/student/${nextIndex}`);
          handled = true;
        } else if (swipe === 'SWIPE_RIGHT' && (isHome || isStudentPage)) {
          const prevIndex = (state.activeStudentIndex - 1 + students.length) % students.length;
          state.setActiveStudentIndex(prevIndex);
          state.setGestureFeedback(i18n.t('gestures.swipe_right', 'Swiping Right...'));
          if (isStudentPage) navigateRef.current(`/student/${prevIndex}`);
          handled = true;
        } else if (swipe === 'SWIPE_UP' && isHome) {
          state.setGestureFeedback(i18n.t('gestures.zooming_in', 'Opening Profile...'));
          navigateRef.current(`/student/${state.activeStudentIndex}`);
          handled = true;
        } else if (swipe === 'SWIPE_DOWN' && isStudentPage) {
          state.setGestureFeedback(i18n.t('gestures.zooming_out', 'Closing Profile...'));
          navigateRef.current('/');
          handled = true;
        }

        if (handled) {
          lastSwipeTimeRef.current = nowPerf;
          wristHistoryRef.current = []; // Reset history after successful swipe
        }
      }
    }
  }, [drawHandVisualization, detectSwipe]);

  // Store processFrame in a ref for the rAF loop
  const processFrameRef = useRef(processFrame);
  useEffect(() => { processFrameRef.current = processFrame; }, [processFrame]);

  useEffect(() => {
    let active = true;

    const initializeMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        if (!active) return;

        recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });

        if (active) startCamera();
      } catch (err) {
        console.error("MediaPipe Init Error:", err);
        useStore.getState().setGestureFeedback(i18n.t('gestures.init_error', 'Gesture system could not start'));
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 320 }, height: { ideal: 240 } }
        });
        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        setCameraPermission(true);

        const video = document.createElement("video");
        video.srcObject = stream;
        video.addEventListener('loadeddata', () => {
          if (active && predictWebcamRef.current) predictWebcamRef.current();
        });
        video.play();
        videoRef.current = video;
      } catch (err) {
        console.warn("Camera denied or unavailable.");
        setCameraPermission(false);
      }
    };

    predictWebcamRef.current = () => {
      if (!active) return;
      if (videoRef.current && recognizerRef.current && videoRef.current.readyState >= 2) {
        try {
          const results = recognizerRef.current.recognizeForVideo(videoRef.current, performance.now());
          processFrameRef.current(results);
        } catch (err) {
          // Silently handle recognition errors (e.g. timestamp issues)
        }
      }
      requestRef.current = requestAnimationFrame(predictWebcamRef.current);
    };

    initializeMediaPipe();

    return () => {
      active = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, [setCameraPermission]);

  return null;
};

export default useGestureControl;
