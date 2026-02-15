import React from 'react';
import { Link } from 'react-router-dom';

const SubCatHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-[#1B3C53] hover:opacity-80 transition"
          >
            SewaSaathi
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SubCatHeader;
