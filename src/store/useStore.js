import { create } from 'zustand';

const useStore = create((set) => ({
  activeStudentIndex: 0,
  isModalOpen: false,
  cameraPermissionGranted: false,
  isPlaying: false, // For Audio
  gestureFeedback: null,
  theme: 'dark', // 'light' or 'dark'
  handCoordinates: null, // {x, y}
  headOffset: { x: 0, y: 0 },
  isPinching: false,
  forcePushEvent: 0,
  isSecretVideoOpen: false,
  hasLoaded: false,
  gestureZoom: 1,
  handRotation: 0,
  fingerCount: 0,

  setActiveStudentIndex: (index) => set({ activeStudentIndex: index }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setCameraPermission: (isGranted) => set({ cameraPermissionGranted: isGranted }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setGestureFeedback: (text) => set({ gestureFeedback: text }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setHandCoordinates: (coords) => set({ handCoordinates: coords }),
  setHeadOffset: (offset) => set({ headOffset: offset }),
  setIsPinching: (pinching) => set({ isPinching: pinching }),
  triggerForcePush: () => set((state) => ({ forcePushEvent: state.forcePushEvent + 1 })),
  setSecretVideoOpen: (isOpen) => set({ isSecretVideoOpen: isOpen }),
  setHasLoaded: (loaded) => set({ hasLoaded: loaded }),
  setGestureZoom: (zoom) => set({ gestureZoom: zoom }),
  setHandRotation: (rotation) => set({ handRotation: rotation }),
  setFingerCount: (count) => set({ fingerCount: count })
}));

export default useStore;
