import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, title }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
          {/* Close Button */}
          <div className="sticky top-0 z-10 bg-white px-4 sm:px-6 pt-4 sm:pt-6 flex justify-between items-start border-b border-gray-200 pb-4">
            {title && (
              <h2 className="text-xl font-bold text-gray-900 pr-8">{title}</h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon icon="mdi:close" fontSize={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};
