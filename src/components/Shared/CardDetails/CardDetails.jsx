import React from "react";
import "./CardDetails.scss";

// SVG Component for the specific angled line
const AngledDivider = () => (
  <svg
    className="angled-divider"
    viewBox="0 0 100 12"
    preserveAspectRatio="none"
    width="100%"
    height="10" // Adjust height as needed
  >
    {/* This path draws a line from left, angles up at 70%, then goes right */}
    <path
      d="M0 10 L70 10 L72 0 L100 0"
      vectorEffect="non-scaling-stroke"
      fill="none"
      stroke="#e0e0e0"
      strokeWidth="1"
    />
  </svg>
);

const CardDetails = ({ sectionTitle = "Key Figures", cards = [], children }) => {
  return (
    <div className="container mx-auto px-8 relative">
      {/* 1. The Angled Divider at the very top */}
      <AngledDivider />

      <div className="card-details">
        {/* Section Title */}
        <div className="section-title">
          {sectionTitle && (
            <h3 className="text-2xl mr-3  md:text-3xl lg:text-4xl font-bold">{sectionTitle}</h3>
          )}
          {children}
        </div>

        {/* Content Rows */}
        <div className="cards-wrapper">
          {cards.map((card, index) => (
            <div key={index} className="card">
              {/* Label (Column 2) */}
              <p className="card-text">{card.cardText}</p>

              {/* Value (Column 3) */}
              <div className="card-value-group">
                <h2 className="card-title">{card.cardTitle}</h2>
                {card.date && <span className="card-date">{card.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardDetails;