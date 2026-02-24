import React, { useState } from 'react';
import BaseModal from './BaseModal';
import UniformButton from './UniformButton';

/**
 * CancelModal Component - Modal for canceling scheduled payments
 * Matches RefundModal design for consistency
 */
const CancelModal = ({ 
  payment,
  onClose = () => {},
  onCancel = () => {}
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onCancel({ reason, payment });
    onClose();
  };

  return (
    <>
      <style>
        {`
          .cancel-modal-overlay {
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

          .cancel-modal {
            background-color: var(--u-color-background-popover, #fefefe);
            border-radius: var(--u-border-radius-large, 8px);
            box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.3), 0px 0px 64px 0px rgba(0, 0, 0, 0.2);
            padding: var(--u-space-one-and-half, 24px);
            width: 100%;
            max-width: 520px;
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one, 16px);
          }

          .cancel-modal-header {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
            width: 100%;
          }

          .cancel-modal-title {
            flex-grow: 1;
            font-family: var(--u-font-body);
            font-size: 22px;
            font-weight: var(--u-font-weight-regular, 400);
            line-height: 26px;
            letter-spacing: -0.5px;
            color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .cancel-modal-close {
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-modal-divider {
            height: 1px;
            background-color: var(--u-color-line-subtle, #c4c6c8);
            width: 100%;
            margin: 0;
          }


          .cancel-modal-description {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.5;
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-modal-payment-info {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one, 16px);
          }

          .cancel-modal-payment-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
          }

          .cancel-modal-payment-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-extra-small, 12px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-modal-payment-value {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-modal-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
            width: 100%;
          }

          .cancel-modal-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
            display: flex;
            gap: var(--u-space-eighth, 2px);
          }

          .cancel-modal-required {
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .cancel-modal-textarea {
            width: 100%;
            min-height: 120px;
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-small, 2px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground-contrast, #071c31);
            background-color: var(--u-color-background-container, #fefefe);
            resize: vertical;
            outline: none;
          }

          .cancel-modal-textarea::placeholder {
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .cancel-modal-textarea:focus {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .cancel-modal-help-text {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            color: var(--u-color-subtle, #506277);
          }

          .cancel-modal-footer {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
            justify-content: flex-end;
            width: 100%;
          }
        `}
      </style>

      <div className="cancel-modal-overlay" onClick={onClose}>
        <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="cancel-modal-header">
            <div className="cancel-modal-title">Cancel Payment</div>
            <button className="cancel-modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="cancel-modal-divider"></div>

          {/* Description */}
          <p className="cancel-modal-description">
            Canceling this scheduled payment will prevent it from being processed. <strong>This action cannot be undone.</strong>
          </p>

          {/* Payment Info */}
          <div className="cancel-modal-payment-info">
            <div className="cancel-modal-payment-field">
              <div className="cancel-modal-payment-label">Description</div>
              <div className="cancel-modal-payment-value">{payment?.description}</div>
            </div>
            <div className="cancel-modal-payment-field">
              <div className="cancel-modal-payment-label">Amount</div>
              <div className="cancel-modal-payment-value">{payment?.amount}</div>
            </div>
            <div className="cancel-modal-payment-field">
              <div className="cancel-modal-payment-label">Scheduled Date</div>
              <div className="cancel-modal-payment-value">{payment?.date}</div>
            </div>
          </div>

          {/* Note Field */}
          <div className="cancel-modal-field">
            <label className="cancel-modal-label">
              <span>Note</span>
            </label>
            <textarea
              className="cancel-modal-textarea"
              placeholder="Add a note about this cancellation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="cancel-modal-help-text">
              This note will not be visible to the customer.
            </div>
          </div>

          {/* Footer */}
          <div className="cancel-modal-footer">
            <UniformButton
              buttonStyle="minimal"
              buttonType="cancel"
              size="medium"
              onClick={onClose}
            >
              Keep Payment
            </UniformButton>
            <UniformButton
              buttonStyle="standard"
              buttonType="destructive"
              size="medium"
              onClick={handleSubmit}
              disabled={false}
            >
              Cancel Payment
            </UniformButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelModal;

