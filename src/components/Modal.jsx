import React from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

function Modal({ isOpen, onClose, children }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="Modal"
      overlayClassName="Overlay"
    >
      {children}
    </ReactModal>
  );
}

export default Modal;