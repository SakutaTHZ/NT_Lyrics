// useDebouncedCallback.js

import { useCallback, useEffect, useRef } from 'react';

const useDebouncedCallback = (callback, delay) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Keep track of the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // The actual debounced function
  return useCallback((...args) => {
    // Clear the previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      // Execute the latest callback
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
};

export default useDebouncedCallback;