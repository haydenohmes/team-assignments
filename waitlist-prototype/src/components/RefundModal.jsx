import React, { useState } from 'react';
import BaseModal from './BaseModal';
import UniformButton from './UniformButton';

/**
 * RefundModal Component - Modal for processing payment refunds
 * Matches Figma design from Program Management - Payment Plans
 */
const RefundModal = ({ 
  payment,
  onClose = () => {},
  onRefund = () => {}
}) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Calculate maximum refundable amount
  const paymentAmount = parseFloat(payment?.amount?.replace(/[$,]/g, '') || '0');
  const alreadyRefunded = parseFloat(payment?.refunded?.replace(/[$,]/g, '') || '0');
  const maxRefundable = paymentAmount - alreadyRefunded;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    // Validate amount
    if (value && !isNaN(value)) {
      const numValue = parseFloat(value);
      if (numValue > maxRefundable) {
        setError(`Refund amount cannot exceed $${maxRefundable.toFixed(2)}`);
      } else if (numValue <= 0) {
        setError('Refund amount must be greater than $0.00');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleAmountBlur = () => {
    if (amount && !isNaN(amount)) {
      const formatted = parseFloat(amount).toFixed(2);
      setAmount(formatted);
    }
  };

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    // Final validation before submit
    if (numAmount > maxRefundable) {
      setError(`Refund amount cannot exceed $${maxRefundable.toFixed(2)}`);
      return;
    }
    
    if (numAmount <= 0) {
      setError('Refund amount must be greater than $0.00');
      return;
    }
    
    onRefund({ amount, note, payment });
    onClose();
  };

  return (
    <>
      <style>
        {`
          .refund-modal-divider {
            height: 1px;
            background-color: var(--u-color-line-subtle, #c4c6c8);
            width: 100%;
            margin: 0;
          }


          .refund-modal-description {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.5;
            color: var(--u-color-base-foreground, #36485c);
          }

          .refund-modal-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
            width: 100%;
          }

          .refund-modal-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
            display: flex;
            gap: var(--u-space-eighth, 2px);
          }

          .refund-modal-required {
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .refund-modal-input-wrapper {
            display: flex;
            align-items: center;
            background-color: var(--u-color-background-container, #fefefe);
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-small, 2px);
            height: 40px;
            overflow: hidden;
            transition: border-color 0.2s ease;
          }

          .refund-modal-input-wrapper:focus-within:not(.error) {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .refund-modal-input-prefix {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 var(--u-space-one, 16px);
            border-right: 1px solid var(--u-color-line-subtle, #c4c6c8);
            height: 100%;
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .refund-modal-input {
            flex-grow: 1;
            border: none;
            outline: none;
            padding: 0 var(--u-space-one, 16px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground-contrast, #071c31);
            background: transparent;
          }

          .refund-modal-input:focus {
            outline: none;
            box-shadow: none;
          }

          .refund-modal-input::placeholder {
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .refund-modal-help-text {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            color: var(--u-color-subtle, #506277);
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            min-height: 17px;
            display: block;
          }

          .refund-modal-help-text.error {
            color: var(--u-color-alert-foreground, #bb1700);
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            min-height: 17px;
            display: block;
          }

          .refund-modal-input-wrapper.error {
            border-color: var(--u-color-alert-foreground, #bb1700);
          }

          .refund-modal-textarea {
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

          .refund-modal-textarea::placeholder {
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .refund-modal-textarea:focus {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .refund-modal-footer {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
            justify-content: flex-end;
            width: 100%;
          }
        `}
      </style>

      <BaseModal title="Refund Payment" onClose={onClose}>
        <div className="refund-modal-divider"></div>

          {/* Description */}
          <p className="refund-modal-description">
            Refunds take 5-10 days to appear on a customer's statement. Stripe's fees for the original payment won't be returned, but there are no additional fees for the refund.
          </p>

          {/* Amount Field */}
          <div className="refund-modal-field">
            <label className="refund-modal-label">
              <span>Amount</span>
              <span className="refund-modal-required">*</span>
            </label>
            <div className={`refund-modal-input-wrapper ${error ? 'error' : ''}`}>
              <div className="refund-modal-input-prefix">$</div>
              <input
                type="number"
                className="refund-modal-input"
                placeholder="0.00"
                step="0.01"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
              />
            </div>
            <div className={`refund-modal-help-text ${error ? 'error' : ''}`}>
              {error ? error : `Maximum refund amount: $${maxRefundable.toFixed(2)}`}
            </div>
          </div>

          {/* Note Field */}
          <div className="refund-modal-field">
            <label className="refund-modal-label">
              <span>Note</span>
            </label>
            <textarea
              className="refund-modal-textarea"
              placeholder="Add a note about this refund..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="refund-modal-help-text">
              This note will not be visible to the customer.
            </div>
          </div>

          {/* Footer */}
          <div className="refund-modal-footer">
            <UniformButton
              buttonStyle="minimal"
              buttonType="cancel"
              size="medium"
              onClick={onClose}
            >
              Cancel
            </UniformButton>
            <UniformButton
              buttonStyle="standard"
              buttonType="destructive"
              size="medium"
              onClick={handleSubmit}
              disabled={!amount || !!error}
            >
              Refund
            </UniformButton>
          </div>
      </BaseModal>
    </>
  );
};

export default RefundModal;

