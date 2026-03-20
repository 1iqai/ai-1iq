import React from 'react';
import { useTheme } from '../../hooks/useTheme'; 
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate(-1);
    };

    return (
        <div 
            className={`min-h-full flex items-center justify-center p-4 transition-colors duration-300 ${
                isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light'
            }`}
        >
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isDark ? 'bg-red-900/20' : 'bg-red-50'
                        }`}>
                            <svg 
                                className={`w-12 h-12 transition-colors duration-300 ${
                                    isDark ? 'text-red-400' : 'text-red-500'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 
                        className={`text-4xl font-bold transition-colors duration-300 ${
                            isDark ? 'text-red-400' : 'text-red-500'
                        }`}
                    >
                        403
                    </h1>
                    <h2 
                        className={`text-xl font-semibold transition-colors duration-300 ${
                            isDark ? 'text-txt-primary-dark' : 'text-txt-primary-light'
                        }`}
                    >
                        Unauthorized
                    </h2>
                </div>
                <p 
                    className={`transition-colors duration-300 ${
                        isDark ? 'text-txt-secondary-dark' : 'text-txt-secondary-light'
                    }`}
                >
                    Sorry, you don't have permission to access this page. Please check your credentials or contact support if you believe this is an error.
                </p>
                <button 
                    onClick={handleReturn}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                        isDark 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                    }`}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;