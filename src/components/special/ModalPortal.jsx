// components/ModalPortal.jsx or .tsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Wait until mounted for SSR safety
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalRoot = document.getElementById("modal-root");
  return createPortal(children, modalRoot);
};
ModalPortal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ModalPortal;
