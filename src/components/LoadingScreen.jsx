import React from 'react';

const LoadingScreen = ({ text = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            {text && (
                <p className="mt-4 text-gray-600 text-lg font-medium">{text}</p>
            )}
        </div>
    );
};

export default LoadingScreen;
