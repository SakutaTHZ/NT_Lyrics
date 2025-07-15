// useVibration.js
import { useCallback } from 'react';

/**
 * Custom hook to trigger device vibration.
 * Supports both single duration and vibration patterns.
 */
export function useVibration() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern = 200) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    } else {
      console.warn('Vibration API not supported on this device/browser.');
    }
  }, [isSupported]);

  return { vibrate, isSupported };
}
