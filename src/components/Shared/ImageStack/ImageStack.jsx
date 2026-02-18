import React from 'react';
import './ImageStack.scss';

const ImageStack = ({ images = [], height, width, isMobile = false }) => {
    if (isMobile) {
        return (
            <div className="image-stack-container image-stack-container--mobile mt-8 pr-8 flex flex-wrap gap-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.src}
                        alt={img.alt || `Screenshot ${index + 1}`}
                        style={{
                            height: height || 'auto',
                            width: width || 'auto'
                        }}
                        className="image-stack__img rounded-xl shadow-2xl border border-gray-200 object-cover"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="image-stack-container">
            {images.map((img, index) => (
                <div key={index} className="mt-8 pr-8">
                    <img
                        src={img.src}
                        alt={img.alt || `Screenshot ${index + 1}`}
                        style={{
                            height: height || 'auto',
                            width: width || '100%'
                        }}
                        className="image-stack__img w-full h-auto rounded-xl shadow-2xl border border-gray-200"
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageStack;
