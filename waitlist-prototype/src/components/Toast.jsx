import React, { useEffect } from 'react';

/**
 * Toast Component - Uniform Web Storybook design
 * Based on https://uniform-web.storybook.hudltools.com/?path=/story/notifications-toast--demo
 */
const Toast = ({ message, onClose, duration = 3000, type = 'confirmation' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <>
      <style>
        {`
          .uniform-toast-container {
            position: fixed;
            bottom: var(--u-space-two, 32px);
            right: var(--u-space-two, 32px);
            z-index: 10000;
            animation: uniform-toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes uniform-toast-slide-in {
            from {
              opacity: 0;
              transform: translateX(16px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .uniform-toast {
            display: flex;
            background-color: var(--u-color-background-container, #fefefe);
            border-radius: var(--u-border-radius-medium, 4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04);
            min-width: 480px;
            max-width: 600px;
            overflow: hidden;
          }

          .uniform-toast-stripe {
            width: 64px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .uniform-toast.confirmation .uniform-toast-stripe {
            background-color: #5a9216;
          }

          .uniform-toast.info .uniform-toast-stripe {
            background-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .uniform-toast.error .uniform-toast-stripe {
            background-color: var(--u-color-error-background, #c62828);
          }

          .uniform-toast-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--u-color-emphasis-foreground-reversed, #fefefe);
          }

          .uniform-toast-content {
            flex: 1;
            padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
            display: flex;
            flex-direction: column;
            gap: var(--u-space-half, 8px);
            position: relative;
          }

          .uniform-toast-close {
            position: absolute;
            top: var(--u-space-half, 8px);
            right: var(--u-space-half, 8px);
            width: 24px;
            height: 24px;
            border: none;
            background: transparent;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--u-color-base-foreground, #36485c);
            padding: 0;
          }

          .uniform-toast-close:hover {
            color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .uniform-toast-message {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.5;
            color: var(--u-color-base-foreground, #36485c);
            padding-right: var(--u-space-one-and-half, 24px);
          }
        `}
      </style>
      <div className="uniform-toast-container">
        <div className={`uniform-toast ${type}`}>
          <div className="uniform-toast-stripe">
            <div className="uniform-toast-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="uniform-toast-content">
            <button 
              className="uniform-toast-close" 
              onClick={onClose}
              aria-label="Close notification"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <div className="uniform-toast-message">{message}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toast;

