import React from "react";
import "./CardDetailsV2.scss";

const CardDetailsV2 = ({ sectionTitle = "Key Figures", cards = [], image, children }) => {
    return (
        <div className="container mx-auto px-8 relative">
            <div className="card-details-v2">
                <div className="section-title">
                    {sectionTitle && (
                        <h3>{sectionTitle}</h3>
                    )}
                </div>

                <div className="section-content">
                    {image && (
                        <div className="section-media">
                            <img src={image} alt={sectionTitle} />
                        </div>
                    )}

                    {children && (
                        <div className="section-media">
                            {children}
                        </div>
                    )}

                    <div className="cards-wrapper">
                        {cards.map((card, index) => (
                            <div key={index} className="feature-card">
                                <div className="card-header">
                                    <h2 className="card-title">{card.cardTitle}</h2>
                                    {card.date && <span className="card-date">{card.date}</span>}
                                </div>
                                <p className="card-text">{card.cardText}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetailsV2;

