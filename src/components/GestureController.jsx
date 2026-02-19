import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { usePortfolio } from '../context/PortfolioContext';

const GestureController = () => {
  const videoRef = useRef(null);
  const { nextStudent, prevStudent, toggleZoom, toggleAudio, isZoomed } = usePortfolio();
  const [isLoaded, setIsLoaded] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const lastGestureTime = useRef(0);
  const COOLDOWN = 1500; // ms between gestures to prevent spam

  useEffect(() => {
    let handLandmarker;
    let animationFrameId;

    const setupMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        setIsLoaded(true);
        startCamera();
      } catch (error) {
        console.error("MediaPipe Load Error:", error);
      }
    };

    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener("loadeddata", predictWebcam);
            setPermissionGranted(true);
          }
        } catch (err) {
          console.warn("Camera Permission Denied or Error:", err);
          // Fallback UI or toast could show here
        }
      }
    };

    const predictWebcam = () => {
      if (videoRef.current && handLandmarker) {
        let startTimeMs = performance.now();
        const results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
           detectGestures(results.landmarks);
        }
        
        animationFrameId = requestAnimationFrame(predictWebcam);
      }
    };

    const detectGestures = (landmarks) => {
      const now = Date.now();
      if (now - lastGestureTime.current < COOLDOWN) return;

      const hand = landmarks[0]; // Process first hand
      
      // Calculate distances for Pinch (Thumb Tip to Index Tip)
      // Thumb Tip: 4, Index Tip: 8
      const thumbTip = hand[4];
      const indexTip = hand[8];
      const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
      
      // Pinch Detection (Zoom In)
      if (distance < 0.05) {
        if (!isZoomed) {
          console.log("Gesture: PINCH (Zoom In)");
          toggleZoom();
          lastGestureTime.current = now;
          return;
        }
      }

      // Open Palm Detection (Zoom Out / Reset)
      // Check if fingers are extended relative to wrist (0)
      // Simplified: if all tips are far from palm center
      const middleTip = hand[12];
      const ringTip = hand[16];
      const pinkyTip = hand[20];
      
      const palmOpen = middleTip.y < hand[9].y && ringTip.y < hand[13].y && pinkyTip.y < hand[17].y; 
      
      if (palmOpen && isZoomed && distance > 0.1) {
         console.log("Gesture: OPEN PALM (Zoom Out)");
         toggleZoom(); 
         lastGestureTime.current = now;
         return;
      }
      
      // Swipe Detection
      // Based on hand x position relative to frame center (0.5)
      // Or movement history? For now, static position zones:
      // Left side of screen -> Prev, Right side -> Next
      const cx = hand[9].x; // Middle finger mcp as center
      
      // Invert X because camera is mirrored
      if (cx < 0.2) { 
         console.log("Gesture: SWIPE RIGHT (Next)"); // Camera mirrored: Left in frame is user's Right? 
         // Actually, typically < 0.2 is the RIGHT side of the USER if mirrored.
         // Let's assume standard mirror: < 0.2 is right side of video, which is right side of user.
         nextStudent();
         lastGestureTime.current = now;
      } else if (cx > 0.8) {
         console.log("Gesture: SWIPE LEFT (Prev)");
         prevStudent();
         lastGestureTime.current = now;
      }

      // Thumbs Up (Audio Toggle)
      // Thumb tip above index mcp, other fingers curled
      const isThumbUp = thumbTip.y < hand[3].y && indexTip.y > hand[6].y; // Verify verticality
      if (isThumbUp) {
         console.log("Gesture: THUMBS UP (Audio)");
         toggleAudio();
         lastGestureTime.current = now;
      }
    };

    setupMediaPipe();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current && videoRef.current.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [nextStudent, prevStudent, toggleZoom, toggleAudio, isZoomed]);

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 100, opacity: 0.5, pointerEvents: 'none' }}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        style={{ width: '160px', height: '120px', borderRadius: '10px', transform: 'scaleX(-1)' }} 
      />
      {!permissionGranted && (
        <div style={{ color: 'white', fontSize: '12px' }}>
          Waiting for camera...
        </div>
      )}
    </div>
  );
};

export default GestureController;
