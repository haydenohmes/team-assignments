import React from 'react';

const BaseModal = ({ title, onClose, children, maxWidth = '520px' }) => {
  return (
    <>
      <style>
        {`
          .base-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }

          .base-modal {
            background-color: var(--u-color-background-popover, #fefefe);
            border-radius: var(--u-border-radius-large, 8px);
            box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.3), 0px 0px 64px 0px rgba(0, 0, 0, 0.2);
            padding: var(--u-space-one-and-half, 24px);
            width: 100%;
            max-width: ${maxWidth};
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one, 16px);
            max-height: 90vh;
            overflow-y: auto;
          }

          .base-modal-header {
            display: flex;
            justify-content: space-between;
            // align-items: center;
          }

          .base-modal-title {
            font-family: var(--u-font-heading);
            font-size: var(--u-font-size-xx-large, 24px);
            font-weight: var(--u-font-weight-regular, 400);
            color: var(--u-color-base-foreground-contrast, #071c31);
            margin: 0;
          }

          .base-modal-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            color: var(--u-color-base-foreground, #36485c);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .base-modal-close:hover {
            color: var(--u-color-base-foreground-contrast, #071c31);
          }
        `}
      </style>

      <div className="base-modal-overlay" onClick={onClose}>
        <div 
          className="base-modal" 
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth }}
        >
          <div className="base-modal-header">
            <h2 className="base-modal-title">{title}</h2>
            <button className="base-modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {children}
        </div>
      </div>
    </>
  );
};

export default BaseModal;

