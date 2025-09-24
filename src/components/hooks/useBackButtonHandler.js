// hooks/useBackButtonHandler.js
import { useEffect } from "react";

export default function useBackButtonHandler(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    // Push a dummy state so the browser thinks it can "go back"
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      if (isOpen) {
        onClose(); // close modal instead of navigating
        // push the state again so back button still works
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);
}
