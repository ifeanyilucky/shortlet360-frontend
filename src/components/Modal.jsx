import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <div className="absolute top-3 right-3">
          <button type="button" onClick={onClose}>
            <Icon
              icon="mdi:close"
              fontSize={24}
              className="text-gray-500 cursor-pointer"
            />
          </button>
        </div>
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
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
