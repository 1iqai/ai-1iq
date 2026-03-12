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
    <div className="container mx-auto px-6 md:px-12 relative">
      <div className="card-details">
        {/* Section Title (Left Rail) */}
        <div className="section-title">
          <h3>{sectionTitle}</h3>
        </div>

        {/* Content Area (Right Rail) */}
        <div className="section-content">
          {/* Centered Media / Image Area */}
          {children && (
            <div className="section-media">
              {children}
            </div>
          )}

          {/* Content Rows / Features Grid */}
          {cards && cards.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetails;