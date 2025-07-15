import { useCallback, useMemo } from 'react';

const VIBRATION_PATTERNS = {
  short: 50,
  long: 300,
  doubleTap: [50, 100, 50],
  errorBuzz: [100, 50, 100, 50, 100],
  dandadan: [100, 50, 100, 200, 300, 100, 100, 100, 150],
};

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function useVibration({ fallback = false } = {}) {
  const isSupported = useMemo(
    () => typeof navigator !== 'undefined' && 'vibrate' in navigator && isMobileDevice(),
    []
  );

  const vibrateOnce = useCallback(
    (duration = VIBRATION_PATTERNS.short) => {
      if (isSupported) {
        navigator.vibrate(duration);
      } else if (fallback) {
        console.log('[Fallback] Trigger haptic effect:', duration);
        // Optionally trigger fallback animation or sound here
        // e.g., play a soft click sound
      }
    },
    [isSupported, fallback]
  );

  const vibratePattern = useCallback(
    (patternName) => {
      const pattern = VIBRATION_PATTERNS[patternName];
      if (!pattern) {
        console.warn(`Unknown vibration pattern: ${patternName}`);
        return;
      }
      vibrateOnce(pattern);
    },
    [vibrateOnce]
  );

  return {
    vibrateOnce,
    vibratePattern,
    isSupported,
    presets: VIBRATION_PATTERNS,
  };
}