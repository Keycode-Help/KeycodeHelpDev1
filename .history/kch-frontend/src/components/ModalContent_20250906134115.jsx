import React, { useState } from "react";

export function ModalContent({ modalImage, closeModal }) {
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={closeModal}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 hover:scale-110"
          onClick={closeModal}
        >
          &times;
        </button>
        <img 
          src={modalImage} 
          alt="Enlarged View" 
          className="w-full h-full object-contain max-h-[80vh]"
        />
      </div>
    </div>
  );
}
