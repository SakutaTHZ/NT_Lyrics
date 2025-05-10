// hooks/useModalEscClose.js
import { useEffect } from "react";

const useModalEscClose = (onClose) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);
};

export default useModalEscClose;
