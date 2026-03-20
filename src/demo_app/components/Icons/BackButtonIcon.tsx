import React from 'react';

type BackButtonProps = {
  className: string,
  onClick: () => void;
};

export const BackButton: React.FC<BackButtonProps> = ({ className = "", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white 
             hover:from-brand-primary-600 hover:to-brand-primary-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md ${className}`}
      aria-label="Go Back"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};
