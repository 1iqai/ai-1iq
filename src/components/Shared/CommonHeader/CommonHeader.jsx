import React from "react";
import "./CommonHeader.scss";

const CommonHeader = React.forwardRef(({ title, text }, ref) => {
  return (
    <>
      <section ref={ref} className="header-dark">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="header-video"
        >
          <source src="/assets/video/intel_1.mp4" type="video/mp4" />
        </video>
        <div className="section-header">
          <div className="wrapper">
            <h1>{title}</h1>
            <p className="text-base md:text-xl">{text}</p>
          </div>
        </div>
      </section>
    </>
  );
});

export default CommonHeader;
