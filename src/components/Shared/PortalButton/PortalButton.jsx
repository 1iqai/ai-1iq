import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { MetalFx } from "metal-fx";
import "./PortalButton.scss";

const PortalButton = ({
  label,
  href,
  redirectTo,
  showDivider = true,
  fullWidth = false,
  outline = false,
  className = "",
  buttonClassName = "",
  onClick,
  ...buttonProps
}) => {
  const navigate = useNavigate();
  const siblingRef = useRef(null);
  const Component = href ? "a" : "button";
  const componentProps = { ...buttonProps };

  if (href) {
    componentProps.href = href;
  } else if (!componentProps.type) {
    componentProps.type = "button";
  }

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (!redirectTo || event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    navigate(redirectTo);
    window.scrollTo(0, 0);
  };

  if (redirectTo) {
    componentProps.onClick = handleClick;
  } else if (onClick) {
    componentProps.onClick = onClick;
  }

  return (
    <div
      className={[
        "portal-btn-container",
        fullWidth ? "portal-btn-container--full" : "",
        outline ? "portal-btn-container--outline" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <MetalFx preset="chromatic" theme="dark" strength={0.45} reflectionTargets={[siblingRef]}>
        <Component
          ref={siblingRef}
          className={["portal-btn", buttonClassName].filter(Boolean).join(" ")}
          {...componentProps}
        >
          <p className="tracking-widest uppercase">{label}</p>
          <div className="icon-btn">
            <div className="icon-container">
              <div className="arrows-container">
                <GoArrowUpRight className="icon primary-icon" />
                <GoArrowUpRight className="icon secondary-icon" />
              </div>
            </div>
          </div>
        </Component>
      </MetalFx>
      {showDivider && (
        <div className="divider-container">
          <div className="divider right"></div>
        </div>
      )}
    </div>
  );
};

export default PortalButton;
