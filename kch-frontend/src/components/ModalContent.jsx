import React, { useState } from "react";
import "../styles/modalContent.css";

export function ModalContent({ modalImage, closeModal }) {
  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={closeModal}>
        &times;
        </span>
        <img src={modalImage} alt="Enlarged View" className="modal-image" />
      </div>
    </div>
  );
}
