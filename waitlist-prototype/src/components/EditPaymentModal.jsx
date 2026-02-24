import React, { useState } from 'react';
import BaseModal from './BaseModal';
import UniformButton from './UniformButton';

/**
 * EditPaymentModal Component - Modal for modifying scheduled payment details
 * Allows editing scheduled date within Stripe Billing constraints
 */
const EditPaymentModal = ({ 
  payment,
  onClose = () => {},
  onUpdate = () => {}
}) => {
  // Convert date string (e.g., "Jan 10, 2026") to YYYY-MM-DD format for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Try to parse common date formats
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      // If parsing fails, return empty string
    }
    return '';
  };

  // Initialize with current payment values
  const originalDate = payment?.date || '';
  
  const [scheduledDate, setScheduledDate] = useState(formatDateForInput(originalDate));
  const [note, setNote] = useState('');
  const [dateError, setDateError] = useState('');

  // Check if values have changed
  const hasChanges = () => {
    const currentDate = scheduledDate ? new Date(scheduledDate).toISOString().split('T')[0] : '';
    const originalDateFormatted = originalDate ? formatDateForInput(originalDate) : '';
    
    return currentDate !== originalDateFormatted;
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setScheduledDate(value);
    
    // Validate date for Stripe Billing constraints
    if (value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Maximum date: 7 years in the future (Stripe subscription limit)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 7);
      maxDate.setHours(23, 59, 59, 999);
      
      if (selectedDate < today) {
        setDateError('Scheduled date cannot be in the past');
      } else if (selectedDate > maxDate) {
        setDateError('Scheduled date cannot be more than 7 years in the future');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  };

  const handleSubmit = () => {
    // Final validation
    if (!scheduledDate) {
      setDateError('Please select a scheduled date');
      return;
    }
    
    if (dateError) {
      return;
    }

    // Format date for output (convert from YYYY-MM-DD to readable format)
    // Parse date string directly to avoid timezone issues
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // month is 0-indexed
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    onUpdate({
      payment,
      date: formattedDate,
      originalDate,
      note
    });
    onClose();
  };

  return (
    <>
      <style>
        {`
          .edit-payment-modal-divider {
            height: 1px;
            background-color: var(--u-color-line-subtle, #c4c6c8);
            width: 100%;
            margin: 0;
          }

          .edit-payment-modal-description {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.5;
            color: var(--u-color-base-foreground, #36485c);
          }

          .edit-payment-modal-payment-info {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-one, 16px);
          }

          .edit-payment-modal-payment-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
          }

          .edit-payment-modal-payment-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-extra-small, 12px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground, #36485c);
          }

          .edit-payment-modal-payment-value {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
          }

          .edit-payment-modal-field {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-quarter, 4px);
            width: 100%;
          }

          .edit-payment-modal-label {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
            display: flex;
            gap: var(--u-space-eighth, 2px);
          }

          .edit-payment-modal-required {
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .edit-payment-modal-date-input {
            width: 100%;
            height: 40px;
            padding: 0 var(--u-space-one, 16px);
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-small, 2px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground-contrast, #071c31);
            background-color: var(--u-color-background-container, #fefefe);
            outline: none;
          }

          .edit-payment-modal-date-input:focus {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .edit-payment-modal-date-input.error {
            border-color: var(--u-color-alert-foreground, #bb1700);
          }

          .edit-payment-modal-help-text {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-micro, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            line-height: 1.4;
            color: var(--u-color-subtle, #506277);
            background: none;
            border: none;
            padding: Vibranium
            margin: 0;
            min-height: 17px;
            display: block;
          }

          .edit-payment-modal-help-text.error {
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .edit-payment-modal-textarea {
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

          .edit-payment-modal-textarea::placeholder {
            color: var(--u-color-base-foreground-subtle, #607081);
          }

          .edit-payment-modal-textarea:focus {
            border-color: var(--u-color-emphasis-background-contrast, #0273e3);
          }

          .edit-payment-modal-footer {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
            justify-content: flex-end;
            width: 100%;
          }
        `}
      </style>

      <BaseModal title="Edit Payment" onClose={onClose}>
        <div className="edit-payment-modal-divider"></div>

        <p className="edit-payment-modal-description">
          Modify the scheduled payment date. Changes will be reflected in the payment plan.
        </p>

        {/* Scheduled Date Field */}
        <div className="edit-payment-modal-field">
          <label className="edit-payment-modal-label">
            <span>Scheduled Date</span>
            <span className="edit-payment-modal-required">*</span>
          </label>
          <input
            type="date"
            className={`edit-payment-modal-date-input ${dateError ? 'error' : ''}`}
            value={scheduledDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            max={(() => {
              const maxDate = new Date();
              maxDate.setFullYear(maxDate.getFullYear() + 7);
              return maxDate.toISOString().split('T')[0];
            })()}
          />
          <div className={`edit-payment-modal-help-text ${dateError ? 'error' : ''}`}>
            {dateError || 'Select the new scheduled payment date'}
          </div>
        </div>

        {/* Note Field */}
        <div className="edit-payment-modal-field">
          <label className="edit-payment-modal-label">
            <span>Note</span>
          </label>
          <textarea
            className="edit-payment-modal-textarea"
            placeholder="Add a note about this change..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="edit-payment-modal-help-text">
            This note will not be visible to the customer.
          </div>
        </div>

        {/* Footer */}
        <div className="edit-payment-modal-footer">
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
            buttonType="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={!hasChanges() || !!dateError || !scheduledDate}
          >
            Save Changes
          </UniformButton>
        </div>
      </BaseModal>
    </>
  );
};

export default EditPaymentModal;
