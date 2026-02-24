import React from 'react';
import { IconInformation } from './UniformIcons';

/**
 * RegistrantsTable Component - Displays registrant data with athlete details
 * Uses Uniform Web Storybook design tokens and Barlow font
 */
const RegistrantsTable = ({
  registrants = [],
  onRegistrantClick = () => {},
  hideRegistrationColumn = false
}) => {
  // Format refund amount with parentheses
  const formatRefund = (refundString) => {
    if (!refundString || refundString === '$0.00') {
      return '';
    }
    // Remove $ and parse the number
    const amount = parseFloat(refundString.replace(/[$,]/g, ''));
    if (amount === 0) {
      return '';
    }
    // Format with comma and return in parentheses
    return `($${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  };

  // Format discount amount
  const formatDiscount = (discount) => {
    if (!discount || !discount.amount) {
      return '';
    }
    return `($${discount.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  };

  // Map status to account status display
  const getAccountStatus = (status) => {
    switch (status) {
      case 'Paid':
        return 'Completed';
      case 'Current':
        return 'Current';
      case 'Overdue':
        return 'Overdue';
      default:
        // Hide: Refunded, Partially Refunded, Canceled
        return null;
    }
  };

  // Get CSS class for status (only for displayable statuses)
  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'completed';
      case 'Current':
        return 'current';
      case 'Overdue':
        return 'overdue';
      default:
        return '';
    }
  };

  return (
    <>
      <style>
        {`
          .registrants-data-table-container {
            width: 100%;
            background-color: var(--u-color-background-container, #fefefe);
            overflow: visible;
          }

          .registrants-data-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--u-font-body);
          }

          .registrants-data-table th:nth-child(1),
          .registrants-data-table td:nth-child(1) {
            width: 18%;
          }

          .registrants-data-table th:nth-child(2),
          .registrants-data-table td:nth-child(2) {
            width: 8%;
          }

          .registrants-data-table th:nth-child(3),
          .registrants-data-table td:nth-child(3) {
            width: 6%;
          }

          .registrants-data-table th:nth-child(4),
          .registrants-data-table td:nth-child(4),
          .registrants-data-table th:nth-child(5),
          .registrants-data-table td:nth-child(5) {
            width: 10%;
          }

          .registrants-data-table th:nth-child(6),
          .registrants-data-table td:nth-child(6) {
            width: 8%;
          }

          .registrants-data-table th:nth-child(7),
          .registrants-data-table td:nth-child(7) {
            width: 8%;
          }

          .registrants-data-table th:nth-child(8),
          .registrants-data-table td:nth-child(8),
          .registrants-data-table th:nth-child(9),
          .registrants-data-table td:nth-child(9) {
            width: 7%;
          }

          .registrants-data-table th:nth-child(10),
          .registrants-data-table td:nth-child(10) {
            width: 7%;
          }

          .registrants-data-table th:nth-child(11),
          .registrants-data-table td:nth-child(11) {
            width: 12%;
          }

          .registrants-data-table thead {
            background-color: transparent;
          }

          .registrants-data-table thead tr {
            background-color: transparent !important;
          }

          .registrants-data-table thead tr:hover {
            background-color: transparent !important;
          }

          .registrants-data-table th {
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            text-align: left;
            font-weight: var(--u-font-weight-bold, 700);
            font-size: var(--u-font-size-small, 14px);
            color: var(--u-color-base-foreground, #36485c);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.4;
            border-bottom: 1px solid #36485C !important;
            white-space: nowrap;
            background-color: transparent;
          }

          .registrants-data-table th.align-right {
            text-align: right;
          }

          .registrants-data-table tbody tr {
            border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8);
            height: 48px;
            cursor: pointer;
          }

          .registrants-data-table tbody tr:last-child {
            border-bottom: none !important;
          }

          .registrants-data-table tbody tr:hover {
            background-color: var(--u-color-background-subtle, #f5f6f7);
          }

          .registrants-data-table td {
            padding: var(--u-space-half, 8px) var(--u-space-one, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            font-size: var(--u-font-size-small, 14px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .registrants-data-table td.align-right {
            text-align: right;
          }

          .registrants-data-table td.athlete-name {
            font-weight: var(--u-font-weight-bold, 700);
          }

          .registrants-data-table td.refunded-column {
            color: var(--u-color-base-foreground-contrast, #071c31);
          }

          /* Hide Team column */
          .registrants-data-table th.team-column,
          .registrants-data-table td.team-column {
            display: none;
          }

          .registrants-data-table-status {
            display: inline-flex;
            align-items: center;
            gap: var(--u-space-quarter, 4px);
            padding: 4px var(--u-space-half, 8px);
            border-radius: var(--u-border-radius-medium, 4px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-x-small, 12px);
            font-weight: var(--u-font-weight-medium, 500);
            letter-spacing: 0.02em;
          }

          .registrants-data-table-status.completed {
            background-color: transparent;
            color: var(--u-color-success-foreground, #2e7d32);
          }

          .registrants-data-table-status.current {
            background-color: rgba(167, 174, 181, 0.2);
            color: var(--u-color-base-foreground, #36485c);
          }

          .registrants-data-table-status.overdue {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .registrants-data-table-status.canceled {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .registrants-data-table-status-icon {
            width: 12px;
            height: 12px;
          }

          .registrants-data-table-empty-state {
            padding: 64px var(--u-space-one, 16px);
            text-align: center;
            background-color: var(--u-color-background-container, #fefefe);
          }

          .registrants-data-table-empty-title {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-large, 18px);
            font-weight: var(--u-font-weight-bold, 700);
            color: var(--u-color-base-foreground-contrast, #071c31);
            margin: 0 0 var(--u-space-half, 8px) 0;
          }

          .registrants-data-table-empty-description {
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-medium, 16px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground, #36485c);
            margin: 0;
          }

          .registrants-data-table td {
            overflow: visible;
          }

          .outstanding-icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: help;
            width: 16px;
            height: 16px;
            color: #36485c;
            flex-shrink: 0;
            position: relative;
            margin-left: 4px;
          }

          .outstanding-icon-wrapper:hover .outstanding-tooltip {
            opacity: 1;
            visibility: visible;
          }

          .outstanding-tooltip {
            visibility: hidden;
            opacity: 0;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 8px 12px;
            background-color: #071c31;
            color: #fefefe;
            font-family: var(--u-font-body);
            font-size: 12px;
            font-weight: 500;
            line-height: 1.4;
            border-radius: 2px;
            white-space: nowrap;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 10000;
            pointer-events: none;
          }

          .outstanding-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: #071c31;
          }
        `}
      </style>
      <div className="registrants-data-table-container">
        <table className="registrants-data-table">
          <thead>
            <tr>
              <th>Athlete</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Primary Contact</th>
              {!hideRegistrationColumn && <th>Registration</th>}
              <th className="team-column">Team</th>
              <th>Registration Date</th>
              <th className="align-right">Paid to Date</th>
              <th className="align-right">Discounts</th>
              <th className="align-right">Refunded</th>
              <th className="align-right">Outstanding</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {registrants.length > 0 ? (
              registrants.map((registrant, index) => {
                const accountStatus = getAccountStatus(registrant.status);
                // Only render row if status is displayable
                return accountStatus ? (
                <tr key={index} onClick={() => onRegistrantClick(registrant)}>
                  <td className="athlete-name">{registrant.athlete}</td>
                  <td>{registrant.dob}</td>
                  <td>{registrant.gender}</td>
                  <td>{registrant.primaryContact}</td>
                  {!hideRegistrationColumn && <td>{registrant.registration}</td>}
                  <td className="team-column">{registrant.team}</td>
                  <td>{registrant.registrationDate}</td>
                  <td className="align-right">{registrant.totalPaid}</td>
                  <td className="align-right">{formatDiscount(registrant.discount)}</td>
                  <td className="align-right refunded-column">{formatRefund(registrant.refunded)}</td>
                  <td className="align-right">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', position: 'relative' }}>
                      {registrant.outstandingReason === 'canceled' && (
                        <div className="outstanding-icon-wrapper">
                          <IconInformation />
                          <div className="outstanding-tooltip">
                            Payment Plan Canceled
                          </div>
                        </div>
                      )}
                      <span>{registrant.outstanding}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`registrants-data-table-status ${getStatusClass(registrant.status)}`}>
                      {registrant.status === 'Paid' && (
                        <svg className="registrants-data-table-status-icon" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {accountStatus}
                    </span>
                  </td>
                </tr>
                ) : null;
              })
            ) : (
              <tr>
                <td colSpan={hideRegistrationColumn ? 11 : 12} style={{ padding: 0, border: 'none' }}>
                  <div className="registrants-data-table-empty-state">
                    <h3 className="registrants-data-table-empty-title">No registrants found</h3>
                    <p className="registrants-data-table-empty-description">
                      Try adjusting your filters or search to see results.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RegistrantsTable;

