import React, { useState } from 'react';
import BaseModal from './BaseModal';
import UniformButton from './UniformButton';

const CancelPlanModal = ({ scheduledPayments, onClose, onCancel }) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onCancel({
      selectedPayments: scheduledPayments, // Cancel all scheduled payments
      note
    });
    onClose();
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  return (
    <>
      <style>
        {`
          .cancel-plan-modal-divider {
            height: 1px;
            background-color: var(--u-color-line-subtle, #c4c6c8);
            width: 100%;
            margin: 0;
          }


          .cancel-plan-modal-description {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.5;
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-plan-modal-payment-info {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one, 16px);
          }

          .cancel-plan-modal-payment-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
          }

          .cancel-plan-modal-payment-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-extra-small, 12px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-plan-modal-payment-value {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
          }

          .cancel-plan-modal-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
            width: 100%;
          }

          .cancel-plan-modal-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
            display: flex;
            gap: var(--u-space-eighth, 2px);
          }

          .cancel-plan-modal-required {
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .cancel-plan-modal-textarea {
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

          .cancel-plan-modal-textarea::placeholder {
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .cancel-plan-modal-textarea:focus {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .cancel-plan-modal-help-text {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            color: var(--u-color-subtle, #506277);
            margin: 0;
            min-height: 17px;
            background: none;
            border: none;
            padding: 0;
            display: block;
          }

          .cancel-plan-modal-footer {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
            justify-content: flex-end;
            width: 100%;
          }
        `}
      </style>

      <BaseModal title="Cancel Payment Plan" onClose={onClose}>
        <div className="cancel-plan-modal-divider"></div>

        <p className="cancel-plan-modal-description">
          Canceling this payment plan will prevent all {scheduledPayments.length} scheduled payments from being processed. <strong>This action cannot be undone.</strong>
        </p>

        <div className="cancel-plan-modal-payment-info">
          <div className="cancel-plan-modal-payment-field">
            <div className="cancel-plan-modal-payment-label">Total Payments</div>
            <div className="cancel-plan-modal-payment-value">{scheduledPayments.length} scheduled payments</div>
          </div>
          <div className="cancel-plan-modal-payment-field">
            <div className="cancel-plan-modal-payment-label">Total Amount</div>
            <div className="cancel-plan-modal-payment-value">
              ${scheduledPayments.reduce((total, payment) => {
                const amount = parseFloat(payment.amount?.replace(/[$,]/g, '') || '0');
                return total + amount;
              }, 0).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
          </div>
        </div>

        <div className="cancel-plan-modal-field">
          <label className="cancel-plan-modal-label">
            <span>Note</span>
          </label>
          <textarea
            className="cancel-plan-modal-textarea"
            placeholder="Add a note about this cancellation..."
            value={note}
            onChange={handleNoteChange}
          />
          <p className="cancel-plan-modal-help-text">
            This note will not be visible to the customer.
          </p>
        </div>

        <div className="cancel-plan-modal-footer">
          <UniformButton
            buttonStyle="minimal"
            buttonType="subtle"
            size="medium"
            onClick={onClose}
          >
            Keep Plan
          </UniformButton>
          <UniformButton
            buttonStyle="standard"
            buttonType="destructive"
            size="medium"
            onClick={handleSubmit}
          >
            Cancel Plan
          </UniformButton>
        </div>
      </BaseModal>
    </>
  );
};

export default CancelPlanModal;
