import React from 'react';

type LockIconProps={
  className:string
}

export const LockIcon: React.FC<LockIconProps> = ({className}) => (

  <div className={`${className}`}>
<svg
    className="w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect
      width="16"
      height="10"
      x="4"
      y="11"
      rx="2"
      strokeWidth="1.7"
    />
    <path
      strokeWidth="1.7"
      strokeLinecap="round"
      d="M8 11V7a4 4 0 018 0v4"
    />
  </svg>
  </div>
  
);
