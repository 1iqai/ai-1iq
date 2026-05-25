import React, { forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MetalFx } from "metal-fx";
import "./MetalButton.scss";

/**
 * MetalButton Component
 * A premium React component modeled after `@cult-ui/metal-button`.
 * Wraps a button or link element in a MetalFx liquid metal shader ring.
 */
export const MetalButton = forwardRef(({
  children,
  preset = "chromatic",
  theme = "auto",
  strength = 0.9,
  paused = false,
  borderRadius,
  disableGlow = false,
  ringCssPx,
  scale,
  shaderScale,
  variant = "default",
  className = "",
  buttonClassName = "",
  onClick,
  redirectTo,
  href,
  ...buttonProps
}, ref) => {
  const navigate = useNavigate();
  const localRef = useRef(null);
  const elementRef = ref || localRef;

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

  // Map variant class names
  const variantClass = `metal-btn--variant-${variant}`;

  return (
    <div className={`metal-btn-wrapper ${variantClass} ${className}`}>
      <MetalFx
        preset={preset}
        theme={theme}
        strength={strength}
        paused={paused}
        borderRadius={borderRadius}
        disableGlow={disableGlow}
        ringCssPx={ringCssPx}
        scale={scale}
        shaderScale={shaderScale}
        reflectionTargets={[elementRef]}
      >
        <Component
          ref={elementRef}
          className={`metal-btn-core ${buttonClassName}`}
          {...componentProps}
        >
          {children}
        </Component>
      </MetalFx>
    </div>
  );
});

MetalButton.displayName = "MetalButton";

export default MetalButton;
