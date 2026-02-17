import React from 'react';

const ImageStack = ({ images = [], height, width, isMobile = false }) => {
    if (isMobile) {
        return (
            <div className="mt-8 pr-8 flex flex-wrap gap-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.src}
                        alt={img.alt || `Screenshot ${index + 1}`}
                        style={{
                            height: height || 'auto',
                            width: width || 'auto'
                        }}
                        className="rounded-xl shadow-2xl border border-gray-200 object-cover"
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            {images.map((img, index) => (
                <div key={index} className="mt-8 pr-8">
                    <img
                        src={img.src}
                        alt={img.alt || `Screenshot ${index + 1}`}
                        style={{
                            height: height || 'auto',
                            width: width || '100%'
                        }}
                        className="w-full h-auto rounded-xl shadow-2xl border border-gray-200"
                    />
                </div>
            ))}
        </>
    );
};

export default ImageStack;
