import React from "react";
import "./CardDetailsOnly.scss";

const CardDetailsOnly = ({ sectionTitle = "Key Figures", cardText }) => {
  return (
    <div className="container mx-auto px-8">
      <div className="card-details-only">
        <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{sectionTitle}</div>
        <div className="card">
          <p className="card-text">{cardText}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsOnly;
