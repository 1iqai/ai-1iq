import React from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
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
      <Component
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
      {showDivider && (
        <div className="divider-container">
          <div className="divider right"></div>
        </div>
      )}
    </div>
  );
};

export default PortalButton;
