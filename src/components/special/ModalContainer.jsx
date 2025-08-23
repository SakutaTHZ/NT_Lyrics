// components/ModalContainer.jsx
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";

const ModalContainer = ({ isOpen, onClose, children }) => {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          {/* modal box */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-lg p-6 relative z-[101] shadow-xl max-w-3xl w-full"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

ModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalContainer;
