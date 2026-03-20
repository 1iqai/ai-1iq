import React from 'react';

export const LoadingIcon: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
       className="opacity-25"
    />
    <path
      fill="currentColor"
       className="opacity-25"
      d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
    />
  </svg>
);
