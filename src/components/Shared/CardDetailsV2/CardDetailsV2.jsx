import React from "react";
import "./CardDetailsV2.scss";

// SVG Component for the specific angled line
const AngledDivider = () => (
    <svg
        className="angled-divider"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        width="100%"
        height="10"
    >
        <path
            d="M0 10 L70 10 L72 0 L100 0"
            vectorEffect="non-scaling-stroke"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="1"
        />
    </svg>
);

const CardDetailsV2 = ({ sectionTitle = "Key Figures", cards = [], image }) => {
    return (
        <div className="container mx-auto px-8 relative">
            <AngledDivider />
            <div className="card-details-v2">
                <div className="section-title">
                    {sectionTitle && (
                        <h3 className="text-2xl mr-3 md:text-3xl lg:text-4xl font-bold">{sectionTitle}</h3>
                    )}
                </div>

                <div className="content-grid">
                    <div className="cards-wrapper">
                        {cards.map((card, index) => (
                            <div key={index} className="card">
                                <p className="card-text">{card.cardText}</p>
                                <div className="card-value-group">
                                    <h2 className="card-title">{card.cardTitle}</h2>
                                    {card.date && <span className="card-date">{card.date}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {image && (
                        <div className="image-wrapper">
                            <img src={image} alt={sectionTitle} className="side-image" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetailsV2;
