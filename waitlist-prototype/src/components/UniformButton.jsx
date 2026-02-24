import React from 'react';

/**
 * UniformButton - Local implementation of Uniform Web Button patterns
 * Matches the Uniform Web Storybook design system
 */
const UniformButton = ({
  buttonStyle = 'standard',
  buttonType = 'primary',
  size = 'medium',
  icon = null,
  iconAlignment = 'left',
  onClick,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const buttonClass = `uniform-button uniform-button-${buttonStyle} ${className}`;

  // Size mappings
  const sizeStyles = {
    xsmall: {
      padding: children ? '0 var(--u-space-half, 8px)' : 'var(--u-space-quarter, 4px)',
      minHeight: '24px',
      fontSize: 'var(--u-font-size-micro, 12px)',
      iconSize: '16px',
    },
    small: {
      padding: children ? '0 var(--u-space-three-quarter, 12px)' : 'var(--u-space-half, 8px)',
      minHeight: '32px',
      fontSize: 'var(--u-font-size-small, 14px)',
      iconSize: '16px',
    },
    medium: {
      padding: children ? '0 var(--u-space-one, 16px)' : 'var(--u-space-half, 8px)',
      minHeight: '40px',
      fontSize: 'var(--u-font-size-default, 16px)',
      iconSize: '16px',
      width: children ? 'auto' : '40px',
    },
  };

  // Button type and style mappings
  const getButtonStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--u-space-half, 8px)',
      border: 'none',
      borderRadius: 'var(--u-border-radius-small, 2px)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      fontFamily: 'var(--u-font-body)',
      fontWeight: 'var(--u-font-weight-bold)',
      transition: 'all 0.2s ease',
      letterSpacing: '0.25px',
      ...sizeStyles[size],
    };

    if (buttonStyle === 'minimal') {
      return {
        ...baseStyles,
        background: 'transparent',
        color: buttonType === 'primary' 
          ? 'var(--u-color-base-foreground, #36485c)' 
          : 'var(--u-color-base-foreground, #36485c)',
      };
    }

    if (buttonStyle === 'ghost') {
      return {
        ...baseStyles,
        background: 'transparent',
        border: 'none',
        color: 'var(--u-color-base-foreground, #36485c)',
      };
    }

    if (buttonStyle === 'standard') {
      if (buttonType === 'primary') {
        return {
          ...baseStyles,
          backgroundColor: 'var(--u-color-emphasis-background-contrast, #0273e3)',
          color: 'var(--u-color-emphasis-foreground-reversed, #fefefe)',
        };
      }
      if (buttonType === 'subtle') {
        return {
          ...baseStyles,
          backgroundColor: 'var(--u-color-base-background, #e0e1e1)',
          color: 'var(--u-color-base-foreground, #36485c)',
        };
      }
      if (buttonType === 'destructive') {
        return {
          ...baseStyles,
          backgroundColor: 'var(--u-color-alert-foreground, #bb1700)',
          color: 'var(--u-color-emphasis-foreground-reversed, #fefefe)',
        };
      }
    }

    return baseStyles;
  };

  const iconElement = icon ? (
    <div style={{ 
      width: sizeStyles[size].iconSize, 
      height: sizeStyles[size].iconSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
  ) : null;

  return (
    <>
      <style>
        {`
          .uniform-button-ghost:hover:not(:disabled) {
            background-color: var(--u-color-background-subtle, #f5f6f7) !important;
          }
        `}
      </style>
      <button
        onClick={disabled ? undefined : onClick}
        style={getButtonStyles()}
        className={buttonClass}
        disabled={disabled}
        {...props}
      >
        {iconAlignment === 'left' && iconElement}
        {children}
        {iconAlignment === 'right' && iconElement}
      </button>
    </>
  );
};

export default UniformButton;




