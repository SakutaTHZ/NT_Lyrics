// src/hooks/useUpdateChecker.js
import { useEffect } from 'react';

const LOCAL_VERSION_KEY = 'app_version_cache';

const useUpdateChecker = () => {
  useEffect(() => {
    // 1. Get current version exposed globally
    const currentVersion = window.APP_VERSION_HASH; 
    const cachedVersion = localStorage.getItem(LOCAL_VERSION_KEY);

    // Skip check if the version hash isn't available
    if (!currentVersion) {
      console.warn("APP_VERSION_HASH is not set on window.");
      return;
    }

    // 2. Initial Load or Reset: Store current version and exit
    if (!cachedVersion || cachedVersion === 'RESET') {
      localStorage.setItem(LOCAL_VERSION_KEY, currentVersion);
      return;
    }

    // 3. New Version Check
    if (cachedVersion !== currentVersion) {
      
      const confirmUpdate = window.confirm(
        "A new update is available! Click OK to refresh and apply the changes."
      );

      if (confirmUpdate) {
        // Update localStorage BEFORE reloading to prevent immediate re-prompt
        localStorage.setItem(LOCAL_VERSION_KEY, currentVersion);
        
        // Force a hard reload to bust the cache (even Service Worker's cache)
        window.location.reload(true); 
      }
      // If the user cancels, the prompt will reappear on their next page load/visit
    }
  }, []); // Run only once on mount
};

export default useUpdateChecker;