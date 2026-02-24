import React, { useState } from 'react';
import UniformButton from './UniformButton';
import { IconCopy, IconCheck } from './UniformIcons';

/**
 * ShareModal Component - Modal for sharing program links
 * Based on Uniform Web Storybook design patterns
 */
const ShareModal = ({ 
  isOpen = false,
  onClose = () => {},
  programTitle = "2024-2025 Club Dues",
  programUrl = "https://fan.hudl.com/org/82315/program/T3JnYW5pemF0aW9u"
}) => {
  const [copied, setCopied] = useState(false);

  // Reset copied state when modal closes
  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(programUrl).then(() => {
      setCopied(true);
    });
  };

  return (
    <>
      <style>
        {`
          .share-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fade-in 0.2s ease;
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .share-modal {
            background-color: var(--u-color-background-container, #fefefe);
            border-radius: var(--u-border-radius-medium, 4px);
            width: 90%;
            max-width: 600px;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24);
            animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .share-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: var(--u-space-one, 16px);
            padding-bottom: var(--u-space-one, 16px);
            padding-left: var(--u-space-one-and-half, 24px);
            padding-right: var(--u-space-one-and-half, 24px);
          }

          .share-modal-title {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-large, 20px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground-contrast, #071c31);
            margin: 0;
          }

          .share-modal-close {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            cursor: pointer;
            border-radius: var(--u-border-radius-small, 2px);
            color: var(--u-color-base-foreground, #36485c);
          }

          .share-modal-close:hover {
            background-color: var(--u-color-background-subtle, #f5f6f7);
          }

          .share-modal-body {
            margin-top: none;
            // margin-bottom: var(--u-space-one-and-half, 24px);
            margin-left: var(--u-space-one-and-half, 24px);
            margin-right: var(--u-space-one-and-half, 24px);
            padding-top: var(--u-space-one-and-half, 24px);
            padding-bottom: var(--u-space-one-and-half, 24px);
            border-top: 1px solid var(--u-color-line-subtle, #c4c6c8);
            // border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
          }

          .share-modal-description {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-regular, 400);
            color: var(--u-color-base-foreground, #36485c);
            margin: 0 0 var(--u-space-one, 16px) 0;
            line-height: 1.5;
          }

          .share-modal-url-container {
            background-color: var(--u-color-background-subtle, #f5f6f7);
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-small, 2px);
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            color: var(--u-color-base-foreground, #36485c);
            word-break: break-all;
            user-select: all;
          }

          .share-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: var(--u-space-half, 8px);
            padding-top: none;
            padding-bottom: var(--u-space-one-and-half, 24px);
            padding-left: var(--u-space-one-and-half, 24px);
            padding-right: var(--u-space-one-and-half, 24px);
          }

          .share-modal-copy-button-success button {
            background-color: #5a9216 !important;
            border: none !important;
          }

          .share-modal-copy-button-success button:hover {
            background-color: #4a7912 !important;
          }
        `}
      </style>
      <div className="share-modal-overlay" onClick={handleClose}>
        <div className="share-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="share-modal-header">
            <h2 className="share-modal-title">Share Program</h2>
            <button className="share-modal-close" onClick={handleClose} aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="share-modal-body">
            <p className="share-modal-description">
              Copy link to share this program or post it on social media.
            </p>
            <div className="share-modal-url-container">
              {programUrl}
            </div>
          </div>

          {/* Footer */}
          <div className="share-modal-footer">
            <UniformButton
              buttonStyle="standard"
              buttonType="subtle"
              size="medium"
              onClick={handleClose}
            >
              Cancel
            </UniformButton>
            <div className={copied ? 'share-modal-copy-button-success' : ''}>
              <UniformButton
                buttonStyle="standard"
                buttonType="primary"
                size="medium"
                icon={copied ? <IconCheck /> : <IconCopy />}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </UniformButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;

