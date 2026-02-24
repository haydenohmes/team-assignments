import React, { useState } from 'react';
import UniformButton from './UniformButton';
import { IconCopy, IconCheck, IconInformation } from './UniformIcons';

/**
 * DataWidget Component - Overview data widget based on Figma design
 * Supports three size variants: medium, small, extra-small
 * Uses Uniform Web Storybook design tokens and Barlow font
 */
const DataWidget = ({
  size = 'medium', // 'medium', 'small', 'extra-small'
  label = 'Card Label',
  value = '000',
  avatar = null, // URL to avatar image
  subheader = null, // Subheader text (can include bullet separator)
  rows = [],
  onRowButtonClick = () => {},
  labelTooltip = null // Optional tooltip text to display next to label
}) => {
  const [copiedRowIndex, setCopiedRowIndex] = useState(null);

  const handleCopyRow = (index, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRowIndex(index);
      setTimeout(() => {
        setCopiedRowIndex(null);
      }, 2000);
    });
  };

  // Helper function to determine value styling
  const getValueStyle = (rowValue, valueStyle) => {
    // If explicit valueStyle is provided, use it
    if (valueStyle) return valueStyle;
    
    // Auto-detect negative values (starts with - or contains negative amount)
    const valueStr = String(rowValue);
    if (valueStr.startsWith('-') || valueStr.startsWith('($')) {
      return 'negative';
    }
    
    return 'default';
  };

  // Font sizes for the display value based on size variant
  const displayFontSizes = {
    medium: '44px',
    small: '32px',
    'extra-small': '24px'
  };

  // Font styles for the display value
  const displayFontStyles = {
    medium: {
      fontStyle: 'italic',
      fontWeight: 'var(--u-font-weight-bold, 700)',
      lineHeight: 1
    },
    small: {
      fontStyle: 'italic',
      fontWeight: 'var(--u-font-weight-bold, 700)',
      lineHeight: 1
    },
    'extra-small': {
      fontStyle: 'normal',
      fontWeight: 'var(--u-font-weight-bold, 700)',
      lineHeight: 1.2
    }
  };

  return (
    <>
      <style>
        {`
          .data-widget {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
            flex: 1;
            min-width: 0;
          }

          .data-widget-label-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .data-widget-label {
            font-family: var(--u-font-body);
            font-weight: var(--u-font-weight-bold, 700);
            font-size: var(--u-font-size-default, 16px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.2;
            margin: 0;
          }

          .data-widget-tooltip-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: help;
            width: 16px;
            height: 16px;
            color: var(--u-color-base-foreground, #36485c);
            flex-shrink: 0;
            position: relative;
          }

          .data-widget-tooltip-icon:hover .data-widget-tooltip {
            visibility: visible;
            opacity: 1;
          }

          .data-widget-tooltip {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 8px 12px;
            background-color: var(--u-color-base-foreground-contrast, #071c31);
            color: var(--u-color-emphasis-foreground-reversed, #fefefe);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            border-radius: var(--u-border-radius-small, 2px);
            white-space: nowrap;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 1000;
          }

          .data-widget-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .data-widget-row-tooltip-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: help;
            width: 16px;
            height: 16px;
            color: var(--u-color-base-foreground, #36485c);
            flex-shrink: 0;
            position: relative;
            margin-left: 4px;
          }

          .data-widget-row-tooltip-icon:hover .data-widget-row-tooltip {
            visibility: visible;
            opacity: 1;
          }

          .data-widget-row-tooltip {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 8px 12px;
            background-color: var(--u-color-base-foreground-contrast, #071c31);
            color: var(--u-color-emphasis-foreground-reversed, #fefefe);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            border-radius: var(--u-border-radius-small, 2px);
            white-space: nowrap;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 1000;
          }

          .data-widget-row-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .data-widget-detail {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
            padding: var(--u-space-quarter, 4px) 0 var(--u-space-three-quarter, 12px) 0;
            width: 100%;
          }

          .data-widget-lead {
            display: flex;
            gap: var(--u-space-three-quarter, 12px);
            align-items: center;
            width: 100%;
          }

          .data-widget-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
          }

          .data-widget-value-container {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one-half, 8px);
            padding: var(--u-space-quarter, 4px) 0;
            flex: 1;
            min-width: 0;
          }

          .data-widget-value {
            font-family: var(--u-font-body);
            color: var(--u-color-base-foreground-contrast, #071c31);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            margin: 0;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .data-widget-subheader {
            font-family: var(--u-font-body);
            font-weight: var(--u-font-weight-medium, 500);
            font-size: var(--u-font-size-small, 14px);
            color: var(--u-color-base-foreground, #36485c);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.4;
            margin: 0;
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
          }

          .data-widget-summaries {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-zero, 0px);
            width: 100%;
          }

          .data-widget-row {
            background-color: var(--u-color-background-container, #fefefe);
            border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
            display: flex;
            gap: var(--u-space-one, 16px);
            height: 40px;
            align-items: center;
            padding: var(--u-space-half, 8px) 0;
          }

          .data-widget-row-label {
            font-family: var(--u-font-body);
            font-weight: var(--u-font-weight-medium, 500);
            font-size: var(--u-font-size-small, 14px);
            color: var(--u-color-base-foreground, #36485c);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.4;
            margin: 0;
            white-space: pre;
            text-wrap: nowrap;
          }

          .data-widget-row-value-container {
            display: flex;
            gap: var(--u-space-quarter, 4px);
            align-items: center;
            justify-content: flex-end;
            flex: 1;
            min-width: 0;
          }

          .data-widget-row-value {
            font-family: var(--u-font-body);
            font-weight: var(--u-font-weight-medium, 500);
            font-size: var(--u-font-size-small, 14px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.4;
            margin: 0;
            white-space: pre;
            text-wrap: nowrap;
            text-align: right;
          }
        `}
      </style>
      <div className="data-widget">
        {/* Card Label */}
        <div className="data-widget-label-container">
          <p className="data-widget-label">{label}</p>
          {labelTooltip && (
            <div className="data-widget-tooltip-icon">
              <IconInformation />
              <div className="data-widget-tooltip">
                {labelTooltip}
              </div>
            </div>
          )}
        </div>

        {/* Detail Section */}
        <div className="data-widget-detail">
          {/* Lead/Display Value */}
          <div className="data-widget-lead">
            {/* Avatar (optional) */}
            {avatar && (
              <img 
                src={avatar} 
                alt={label}
                className="data-widget-avatar"
              />
            )}
            
            <div className="data-widget-value-container">
              <p 
                className="data-widget-value" 
                style={{
                  fontSize: displayFontSizes[size],
                  ...displayFontStyles[size]
                }}
              >
                {value}
              </p>
              
              {/* Subheader (optional) */}
              {subheader && (
                <div className="data-widget-subheader">
                  {subheader.split(' · ').map((part, index, array) => (
                    <React.Fragment key={index}>
                      <span>{part}</span>
                      {index < array.length - 1 && <span>·</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Rows */}
          {rows.length > 0 && (
            <div className="data-widget-summaries">
              {rows.map((row, index) => (
                  <div key={index} className="data-widget-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <p className="data-widget-row-label">{row.label}</p>
                    {row.labelTooltip && (
                      <div className="data-widget-row-tooltip-icon">
                        <IconInformation />
                        <div className="data-widget-row-tooltip">
                          {row.labelTooltip}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="data-widget-row-value-container">
                    {row.hasButton && (
                      <UniformButton
                        buttonStyle={row.buttonStyle || "minimal"}
                        buttonType="primary"
                        size="xsmall"
                        icon={row.buttonIcon}
                        style={row.customStyle}
                        onClick={() => row.onButtonClick ? row.onButtonClick() : onRowButtonClick(index, row)}
                      />
                    )}
                    {row.showCopyButton && (
                      <UniformButton
                        buttonStyle="minimal"
                        buttonType="primary"
                        size="xsmall"
                        icon={copiedRowIndex === index ? <IconCheck /> : <IconCopy />}
                        style={{
                          padding: 0,
                          minHeight: 'auto',
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          border: 'none',
                          outline: 'none',
                          boxShadow: 'none',
                          ...(copiedRowIndex === index ? { color: 'var(--u-color-success-foreground, #2e7d32)' } : {})
                        }}
                        onClick={() => handleCopyRow(index, row.value)}
                      />
                    )}
                    {row.valueTooltip && (
                      <div className="data-widget-row-tooltip-icon">
                        <IconInformation />
                        <div className="data-widget-row-tooltip">
                          {row.valueTooltip}
                        </div>
                      </div>
                    )}
                    <p
                      className="data-widget-row-value"
                      style={row.showCopyButton ? { cursor: 'pointer' } : {}}
                      onClick={row.showCopyButton ? () => handleCopyRow(index, row.value) : undefined}
                    >
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DataWidget;

