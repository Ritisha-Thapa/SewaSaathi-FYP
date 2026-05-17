import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-300">
      <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors z-10 shadow-md"
        >
          <X size={20} className="text-gray-800" />
        </button>

        {/* Image Display */}
        <div className="w-full h-auto p-2 bg-gray-100 flex items-center justify-center rounded-2xl">
          <img 
            src={imageUrl} 
            alt="Booking Attachment" 
            className="max-h-[85vh] max-w-full object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
