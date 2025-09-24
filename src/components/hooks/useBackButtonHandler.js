import { useEffect } from "react";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export default function useBackButtonHandler(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen || isIOS()) return; // skip iOS (swipe not a problem)

    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      if (isOpen) {
        onClose();
        window.history.pushState(null, "", window.location.href);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
}
