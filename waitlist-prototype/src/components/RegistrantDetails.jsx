import React, { useState } from 'react';
import PageHeader from './PageHeader';
import DataWidget from './DataWidget';
import UniformButton from './UniformButton';
import TableToolbar from './TableToolbar';
import RefundModal from './RefundModal';
import CancelPlanModal from './CancelPlanModal';
import EditPaymentModal from './EditPaymentModal';
import { IconCopy, IconCheck, IconMore } from './UniformIcons';

/**
 * RegistrantDetails Component - Individual registrant detail page
 * Shows registrant information, fees, and payment history
 * Reuses PageHeader and DataWidget components
 */
const RegistrantDetails = ({ 
  registrant,
  onBack = () => {},
  breadcrumbText = "Programs",
  onRefund = () => {},
  onCancelPlan = () => {},
  onEditPayment = () => {}
}) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelPlanModal, setShowCancelPlanModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentPlanMenuOpen, setPaymentPlanMenuOpen] = useState(false);

  // Format refund amount with parentheses (for widget display)
  const formatRefund = (refundString) => {
    if (!refundString || refundString === '$0.00') {
      return '($0.00)';
    }
    // Remove $ and parse the number
    const amount = parseFloat(refundString.replace(/[$,]/g, ''));
    if (amount === 0) {
      return '($0.00)';
    }
    // Format with comma and return in parentheses
    return `($${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  };

  // Format refund for payment table (empty string for $0.00)
  const formatPaymentRefund = (refundString) => {
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

  // Format discount for payment table
  const formatPaymentDiscount = (discountApplied) => {
    if (!discountApplied || discountApplied === 0) {
      return '';
    }
    return `($${discountApplied.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(registrant.email).then(() => {
      setEmailCopied(true);
      // Reset the checkmark after 2 seconds
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    });
  };

  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleRefund = (payment, index) => {
    setSelectedPayment(payment);
    setShowRefundModal(true);
    setOpenMenuIndex(null);
  };

  const handleRefundSubmit = (refundData) => {
    onRefund(refundData);
  };


  const handleEdit = (payment, index) => {
    setSelectedPayment(payment);
    setShowEditPaymentModal(true);
    setOpenMenuIndex(null);
  };

  const handleEditSubmit = (updateData) => {
    onEditPayment({ ...updateData, registrant });
  };

  const handlePaymentPlanMenuToggle = () => {
    setPaymentPlanMenuOpen(!paymentPlanMenuOpen);
  };

  const handleCancelPlan = () => {
    setShowCancelPlanModal(true);
    setPaymentPlanMenuOpen(false);
  };

  const handleCancelPlanSubmit = ({ selectedPayments, note }) => {
    onCancelPlan({ registrant, scheduledPayments: selectedPayments, note });
  };


  // Calculate payment plan details
  const scheduledPayments = registrant.payments.filter(p => p.status === 'Scheduled');
  const hasActivePaymentPlan = registrant.paymentPlan !== 'Full Payment' && scheduledPayments.length > 0;
  const paymentPlanStatus = scheduledPayments.length > 0 ? 'Active' : 'Canceled';
  
  let nextPayment = null;
  if (scheduledPayments.length > 0) {
    // Find the earliest scheduled payment
    const sortedPayments = [...scheduledPayments].sort((a, b) => new Date(a.date) - new Date(b.date));
    const next = sortedPayments[0];
    nextPayment = `${next.date} for ${next.amount}`;
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.payment-action-menu-container') && 
          !event.target.closest('.payment-plan-action-menu-container')) {
        setOpenMenuIndex(null);
        setPaymentPlanMenuOpen(false);
      }
    };

    if (openMenuIndex !== null || paymentPlanMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuIndex, paymentPlanMenuOpen]);

  return (
    <>
      <style>
        {`
          .registrant-details-main {
            background-color: white;
            padding: 28px 64px;
            display: flex;
            flex-direction: column;
            gap: var(--u-space-two, 32px);
          }

          .registrant-details-widgets {
            display: flex;
            gap: var(--u-space-three, 48px);
          }

          .registrant-details-main .page-header-actions {
            display: none !important;
          }

          .registrant-details-payment-plan-table th:nth-child(1),
          .registrant-details-payment-plan-table td:nth-child(1) {
            width: 20%;
          }

          .registrant-details-payment-plan-table th:nth-child(2),
          .registrant-details-payment-plan-table td:nth-child(2) {
            width: auto;
          }

          .registrant-details-payment-plan-table th:nth-child(3),
          .registrant-details-payment-plan-table td:nth-child(3) {
            width: 10%;
          }

          .registrant-details-payment-plan-table th:nth-child(4),
          .registrant-details-payment-plan-table td:nth-child(4) {
            width: 13%;
          }

          .registrant-details-payment-plan-table th:nth-child(5),
          .registrant-details-payment-plan-table td:nth-child(5) {
            width: 7%;
          }

          .registrant-details-payment-plan-table td.payment-plan-col {
            font-weight: var(--u-font-weight-bold, 700);
          }

          .registrant-details-payment-plan-table tbody tr:hover {
            background-color: transparent;
            cursor: default;
          }

          .payment-plan-status-badge {
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

          .payment-plan-status-badge.active {
            background-color: rgba(167, 174, 181, 0.2);
            color: var(--u-color-base-foreground, #36485c);
          }

          .payment-plan-status-badge.canceled {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .registrant-details-table-container {
            width: 100%;
            background-color: var(--u-color-background-container, #fefefe);
            overflow: visible;
          }

          .registrant-details-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--u-font-body);
            overflow: visible;
          }

          .registrant-details-table th:nth-child(1),
          .registrant-details-table td:nth-child(1) {
            width: 20%;
          }

          .registrant-details-table th:nth-child(2),
          .registrant-details-table td:nth-child(2) {
            width: 10%;
          }

          .registrant-details-table th:nth-child(3),
          .registrant-details-table td:nth-child(3) {
            width: 10%;
          }

          .registrant-details-table th:nth-child(4),
          .registrant-details-table td:nth-child(4) {
            width: 10%;
          }

          .registrant-details-table th:nth-child(5),
          .registrant-details-table td:nth-child(5) {
            width: 10%;
          }

          .registrant-details-table th:nth-child(6),
          .registrant-details-table td:nth-child(6) {
            width: 10%;
          }

          .registrant-details-table th:nth-child(7),
          .registrant-details-table td:nth-child(7) {
            width: 10%;
          }

          .registrant-details-table th:nth-child(8),
          .registrant-details-table td:nth-child(8) {
            width: 10%;
          }

          .registrant-details-table thead {
            background-color: transparent;
            border-bottom: 1px solid #071C31;
          }

          .registrant-details-table thead tr {
            background-color: transparent !important;
          }

          .registrant-details-table thead tr:hover {
            background-color: transparent !important;
          }

          .registrant-details-table th {
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            text-align: left;
            font-weight: var(--u-font-weight-bold, 700);
            font-size: var(--u-font-size-small, 14px);
            color: var(--u-color-base-foreground, #36485c);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.4;
            background-color: transparent;
          }

          .registrant-details-table th.align-right {
            text-align: right;
          }

          .registrant-details-table tbody tr {
            border-bottom: 1px dashed var(--u-color-line-subtle, #c4c6c8) !important;
            height: 48px;
          }

          .registrant-details-table tbody tr:last-child {
            border-bottom: none;
          }

          .registrant-details-table tbody tr:hover {
            background-color: transparent;
            cursor: default;
          }

          .registrant-details-table td {
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

          .registrant-details-table td:last-child {
            overflow: visible;
          }

          .registrant-details-table td:nth-child(2) {
            overflow: visible;
          }

          .registrant-details-table td.align-right {
            text-align: right;
          }

          .registrant-details-table td.description-col {
            font-weight: var(--u-font-weight-bold, 700);
          }

          .registrant-details-table td.refunded-column {
            color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .registrant-details-status-badge {
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

          .registrant-details-status-badge.paid {
            background-color: transparent;
            color: var(--u-color-success-foreground, #2e7d32);
          }

          .registrant-details-status-badge.scheduled {
            background-color: rgba(167, 174, 181, 0.2);
            color: var(--u-color-base-foreground, #36485c);
          }

          .registrant-details-status-badge.refunded {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .registrant-details-status-badge.partially-refunded {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .registrant-details-status-badge.canceled {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .registrant-details-status-badge.overdue {
            background-color: var(--u-color-alert-background, #fef0ee);
            color: var(--u-color-alert-foreground, #bb1700);
          }

          .payment-action-menu-container {
            position: relative;
            display: flex;
            justify-content: flex-end;
            width: 100%;
          }

          .payment-action-menu {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: var(--u-space-quarter, 4px);
            background-color: white;
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            min-width: 160px;
            z-index: 1000;
            overflow: hidden;
          }

          .payment-action-menu-item {
            display: block;
            width: 100%;
            padding: var(--u-space-three-quarter, 12px) var(--u-space-one, 16px);
            border: none;
            background: none;
            text-align: left;
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-small, 14px);
            font-weight: var(--u-font-weight-medium, 500);
            color: var(--u-color-base-foreground-contrast, #071c31);
            cursor: pointer;
            transition: background-color 0.15s ease;
          }

          .payment-action-menu-item:hover {
            background-color: var(--u-color-background-subtle, #f5f6f7);
          }

          .payment-action-menu-item:active {
            background-color: var(--u-color-background-default, #e8eaec);
          }

          .registrant-details-table tbody td:last-child {
            text-align: right;
          }

          .payment-date-tooltip-container {
            position: relative;
            display: inline-block;
            overflow: visible;
          }

          .payment-date-tooltip-container:hover .payment-date-tooltip {
            visibility: visible;
            opacity: 1;
          }

          .payment-date-tooltip {
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
            white-space: normal;
            max-width: 320px;
            min-width: 200px;
            text-align: left;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            z-index: 1500;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .payment-date-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid transparent;
            border-top-color: var(--u-color-base-foreground-contrast, #071c31);
          }

          @media (max-width: 767px) {
            .registrant-details-main {
              padding: 16px;
            }

            .registrant-details-widgets {
              flex-direction: column;
              gap: var(--u-space-one-half, 24px);
            }
          }
        `}
      </style>
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: 'white', minHeight: '100vh' }}>
        <main className="registrant-details-main">
          {/* Page Header */}
          <PageHeader 
            title="Registration Details"
            subtitle={`Registration Date: ${registrant.registrationDate} · Order ID: ${registrant.orderId}`}
            showBreadcrumbs={true}
            showTabs={false}
            showToggle={false}
            showShare={false}
            breadcrumbText={breadcrumbText}
            onBack={onBack}
          />

          {/* Data Widgets */}
          <div className="registrant-details-widgets">
            <DataWidget
              label="Registrant"
              value={registrant.athlete}
              size="small"
              rows={[
                { label: "Primary Contact", value: registrant.primaryContact },
                {
                  label: "Primary Contact Email",
                  value: registrant.email,
                  showCopyButton: true
                },
                { label: "Team", value: registrant.team }
              ]}
            />
            
            <DataWidget
              label="Value"
              value={registrant.totalFees}
              size="small"
              rows={[
                { label: "Paid to Date", value: registrant.totalPaid },
                { label: "Outstanding", value: registrant.outstanding, labelTooltip: registrant.outstandingReason === 'canceled' ? 'Payment Plan Canceled' : undefined },
                { label: "Refunded", value: (() => {
                  const amount = parseFloat((registrant.refunded || '$0.00').replace(/[$,]/g, ''));
                  return `($${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
                })() },
                { label: "Discount", value: (() => {
                  if (registrant.discount && registrant.discount.amount) {
                    return `($${registrant.discount.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
                  }
                  return `($0.00)`;
                })(), labelTooltip: registrant.discount ? registrant.discount.description : undefined }
              ]}
            />
          </div>

          {/* Payment Plan Section - Only show if user is on a payment plan */}
          {registrant.paymentPlan !== 'Full Payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-half, 8px)' }}>
              <TableToolbar
                title="Payment Plan"
                showFilter={false}
                showSearch={false}
                showDownload={false}
              />
              
              <div className="registrant-details-table-container">
                <table className="registrant-details-table registrant-details-payment-plan-table">
                  <thead>
                    <tr>
                      <th>Payment Plan</th>
                      <th>Next Payment</th>
                      <th>Frequency</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="payment-plan-col">Deposit + {scheduledPayments.length > 0 ? scheduledPayments.length : registrant.payments.filter(p => p.status === 'Canceled').length} Installments</td>
                      <td>{nextPayment || '—'}</td>
                      <td>Monthly</td>
                      <td>
                        <span className={`payment-plan-status-badge ${paymentPlanStatus.toLowerCase()}`}>
                          {paymentPlanStatus}
                        </span>
                      </td>
                      <td>
                        <div className="payment-plan-action-menu-container" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                          <UniformButton
                            buttonStyle="ghost"
                            buttonType="subtle"
                            size="small"
                            icon={<IconMore />}
                            onClick={handlePaymentPlanMenuToggle}
                            disabled={!hasActivePaymentPlan}
                          />
                          {hasActivePaymentPlan && paymentPlanMenuOpen && (
                            <div className="payment-action-menu">
                              <button
                                className="payment-action-menu-item"
                                onClick={handleCancelPlan}
                              >
                                Cancel Plan
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-half, 8px)' }}>
            <TableToolbar
              title="Payments"
              showFilter={false}
              showSearch={false}
              showDownload={false}
            />
            
            {/* Payments Table */}
            <div className="registrant-details-table-container">
              <table className="registrant-details-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th className="align-right">Amount</th>
                  <th className="align-right">Discounts</th>
                  <th className="align-right">Refunded</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {registrant.payments.map((payment, index) => (
                  <tr key={index}>
                    <td className="description-col">{payment.description}</td>
                    <td>
                      {payment.isModified && payment.originalDate ? (
                        <div className="payment-date-tooltip-container">
                          <span 
                            style={{ 
                              cursor: 'help',
                              textDecoration: 'underline',
                              textDecorationStyle: 'dotted',
                              textUnderlineOffset: '2px'
                            }}
                          >
                            {payment.date}
                          </span>
                          <div className="payment-date-tooltip">
                            Originally scheduled for {payment.originalDate}
                          </div>
                        </div>
                      ) : (
                        <span>{payment.date}</span>
                      )}
                    </td>
                    <td className="align-right">
                      {payment.originalAmount ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <span style={{ textDecoration: 'line-through', color: '#6b7280' }}>
                            {payment.originalAmount}
                          </span>
                          <span>{payment.amount}</span>
                        </div>
                      ) : (
                        payment.amount
                      )}
                    </td>
                    <td className="align-right">{formatPaymentDiscount(payment.discountApplied)}</td>
                    <td className="align-right refunded-column">{formatPaymentRefund(payment.refunded)}</td>
                    <td>
                      <span className={`registrant-details-status-badge ${payment.status.toLowerCase().replace(/ /g, '-')}`}>
                        {payment.status === 'Paid' && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <div className="payment-action-menu-container">
                        {payment.status !== 'Refunded' && payment.status !== 'Canceled' ? (
                          <>
                            <UniformButton
                              buttonStyle="ghost"
                              buttonType="subtle"
                              size="small"
                              icon={<IconMore />}
                              onClick={() => handleMenuToggle(index)}
                            />
                            {openMenuIndex === index && (
                              <div className="payment-action-menu">
                                {payment.status === 'Paid' || payment.status === 'Partially Refunded' ? (
                                  // Paid or partially refunded payments show Refund
                                  <button
                                    className="payment-action-menu-item"
                                    onClick={() => handleRefund(payment, index)}
                                  >
                                    Refund
                                  </button>
                                ) : (
                                  // Scheduled/future payments show Edit only
                                  <button
                                    className="payment-action-menu-item"
                                    onClick={() => handleEdit(payment, index)}
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          // Fully refunded or cancelled - no actions available
                          <UniformButton
                            buttonStyle="ghost"
                            buttonType="subtle"
                            size="small"
                            icon={<IconMore />}
                            disabled={true}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </main>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <RefundModal
          payment={selectedPayment}
          onClose={() => setShowRefundModal(false)}
          onRefund={handleRefundSubmit}
        />
      )}


      {/* Cancel Plan Modal */}
      {showCancelPlanModal && (
        <CancelPlanModal
          scheduledPayments={scheduledPayments}
          onClose={() => setShowCancelPlanModal(false)}
          onCancel={handleCancelPlanSubmit}
        />
      )}

      {/* Edit Payment Modal */}
      {showEditPaymentModal && selectedPayment && (
        <EditPaymentModal
          payment={selectedPayment}
          onClose={() => setShowEditPaymentModal(false)}
          onUpdate={handleEditSubmit}
        />
      )}
    </>
  );
};

export default RegistrantDetails;

