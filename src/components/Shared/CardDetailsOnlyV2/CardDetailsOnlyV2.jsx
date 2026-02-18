import React from "react";
import "./CardDetailsOnlyV2.scss";

const CardDetailsOnlyV2 = ({ sectionTitle = "Advanced Capabilities", cardText, image }) => {
    return (
        <div className="container mx-auto px-8">
            <div className="card-details-only-v2">
                <div className="section-title">{sectionTitle}</div>
                <div className="info-grid">
                    <div className="content-left">
                        <p className="card-text">{cardText}</p>
                    </div>
                    {image && (
                        <div className="content-right">
                            <img src={image} alt={sectionTitle} className="side-image" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetailsOnlyV2;
