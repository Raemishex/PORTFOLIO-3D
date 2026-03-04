// Haptic feedback utility for mobile devices
const useHaptic = () => {
  const vibrate = (pattern = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    // Light tap - for button clicks, selections
    tap: () => vibrate(15),
    // Medium - for page transitions, swipes
    medium: () => vibrate(30),
    // Heavy - for important actions (profile open/close)
    heavy: () => vibrate([40, 30, 40]),
    // Success - for completed actions
    success: () => vibrate([20, 50, 20]),
    // Error/Warning
    error: () => vibrate([50, 30, 50, 30, 50]),
    // Custom pattern
    custom: (pattern) => vibrate(pattern),
  };
};

export default useHaptic;
