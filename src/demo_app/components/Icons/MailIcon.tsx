import React from 'react';

type MailIconProps = {
  className: string
}


export const MailIcon: React.FC<MailIconProps> = ({ className = "" }) => (
  <div className={`${className}`}>
    <svg
      className="w-5 h-5 text-txt-muted-light dark:text-txt-muted-dark "
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4h16v16H4V4zm16 0L12 13 4 4"
      />
    </svg>
  </div>

);
