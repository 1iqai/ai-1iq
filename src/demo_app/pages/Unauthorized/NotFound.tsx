import React from 'react';
import { useTheme } from '../../hooks/useTheme'; 
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate(-1);
    };

    return (
        <div 
            className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
                isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'
            }`}
        >
            <div className="max-w-md w-full">
                {/* Error Icon Container */}
                <div className="flex justify-center mb-8">
                    <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDark 
                            ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/50' 
                            : 'bg-gradient-to-br from-red-100 to-red-50 border border-red-200'
                    }`}>
                        <svg 
                            className={`w-16 h-16 transition-colors duration-300 ${
                                isDark ? 'text-red-400' : 'text-red-500'
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4 mb-8">
                    <div>
                        <h1 
                            className={`text-6xl font-bold mb-2 transition-colors duration-300 ${
                                isDark ? 'text-red-400' : 'text-red-500'
                            }`}
                        >
                            404
                        </h1>
                        <div className={`h-1 w-12 rounded-full mx-auto ${
                            isDark ? 'bg-red-500/40' : 'bg-red-400'
                        }`} />
                    </div>
                    
                    <div>
                        <h2 
                            className={`text-2xl font-bold transition-colors duration-300 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}
                        >
                            Page Not Found
                        </h2>
                        <p 
                            className={`text-sm mt-2 transition-colors duration-300 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            The page you're looking for doesn't exist
                        </p>
                    </div>
                </div>

                {/* Message */}
                <p 
                    className={`text-center text-sm leading-relaxed mb-8 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                    Sorry, the page you requested could not be found. It may have been removed or the URL might be incorrect.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button 
                        onClick={handleReturn}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            isDark 
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20' 
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                        }`}
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                            isDark 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
                        }`}
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;