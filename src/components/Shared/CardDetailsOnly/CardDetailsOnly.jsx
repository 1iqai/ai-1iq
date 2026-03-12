import React from "react";
import "./CardDetailsOnly.scss";

const CardDetailsOnly = ({ sectionTitle = "Key Figures", cardText }) => {
  return (
    <div className="container mx-auto px-6 md:px-12 relative">
      <div className="card-details-only">
        {/* Section Title (Left Rail) */}
        <div className="section-title">
          <h3>{sectionTitle}</h3>
        </div>

        {/* Content Area (Right Rail) */}
        <div className="section-content">
          <div className="content-text">
            <p>{cardText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsOnly;
