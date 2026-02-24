import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import DataWidget from './DataWidget';
import RegistrationsTable from './RegistrationsTable';
import TableToolbar from './TableToolbar';
import RegistrantsTable from './RegistrantsTable';
import RegistrationOverview from './RegistrationOverview';
import RegistrantDetails from './RegistrantDetails';
import Toast from './Toast';
import ShareModal from './ShareModal';
import UniformButton from './UniformButton';
import { IconDismiss, IconCopy } from './UniformIcons';

/**
 * Mock Dashboard Page - Built with focused components
 * This demonstrates how to build a complete page using components from your Uniform Web Storybook
 */
const MockDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'registrations', or 'waitlist'
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [previousTab, setPreviousTab] = useState('overview'); // Track which tab was active before navigating
  const [showShareModal, setShowShareModal] = useState(false);
  const [registrantsData, setRegistrantsData] = useState(null); // Will be set after initialMockData is created
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering registrants
  const [filterValue, setFilterValue] = useState('All'); // Filter for registrant status
  
  // Mock data from screenshot - 2024-2025 Club Dues Dashboard
  const initialMockData = {
    widgets: [
      {
        label: "Registrants",
        value: "0",
        size: "medium",
        avatar: null,
        subheader: null,
        rows: [
          { label: "Overdue", value: "0", hasButton: false, showCopyButton: false },
          { label: "Overdue Amount", value: "$0.00", hasButton: false, showCopyButton: false },
          { label: "Completed", value: "0", hasButton: false, showCopyButton: false, labelTooltip: "Number of registrants with no remaining balance" }
        ]
      },
      {
        label: "Total Fees",
        value: "0.00",
        size: "medium",
        avatar: null,
        subheader: null,
        labelTooltip: "Sum of paid to date and outstanding",
        rows: [
          { label: "Total Paid to Date", value: "$0.00", hasButton: false, showCopyButton: false },
          { label: "Outstanding", value: "$0.00", hasButton: false, showCopyButton: false },
          { label: "Refunded", value: "$0.00", hasButton: false, showCopyButton: false }
        ]
      }
    ],
    registrations: [
      {
        title: 'U18 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 32
        },
        invitedTeams: ['U18G Gold', 'U18G Blue'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 2,
        enabled: true,
        waitlistOpen: false,
        paymentRequired: true
      },
      {
        title: 'U17 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 32
        },
        invitedTeams: ['U17G Gold', 'U17G Blue'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 2,
        enabled: true,
        waitlistOpen: false,
        paymentRequired: true
      },
      {
        title: 'U16 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 32
        },
        invitedTeams: ['U16G Gold', 'U16G Blue'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 2,
        enabled: true,
        waitlistOpen: false,
        paymentRequired: true
      },
      {
        title: 'U15 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 16
        },
        invitedTeams: ['U15G Gold'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 1,
        enabled: true
      },
      {
        title: 'U14 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 32
        },
        invitedTeams: ['U14G Gold', 'U14G Blue'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 2,
        enabled: true,
        waitlistOpen: false,
        paymentRequired: true
      },
      {
        title: 'U13 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 16
        },
        invitedTeams: ['U13G Gold'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 1,
        enabled: true
      },
      {
        title: 'U12 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 32
        },
        invitedTeams: ['U12G Gold', 'U12G Blue'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 2,
        enabled: true,
        waitlistOpen: false,
        paymentRequired: true
      },
      {
        title: 'U11 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 16
        },
        invitedTeams: ['U11G Gold'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 1,
        enabled: true
      },
      {
        title: 'U10 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 32
        },
        invitedTeams: ['U10G Gold', 'U10G Blue'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 2,
        enabled: true,
        waitlistOpen: false,
        paymentRequired: true
      },
      {
        title: 'U9 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 16
        },
        invitedTeams: ['U9G Gold'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 1,
        enabled: true
      },
      {
        title: 'U8 Girls',
        listPrice: '$1,499.00',
        dateRange: {
          start: 'Jan 15, 2025',
          end: 'Jul 15, 2025'
        },
        paymentOptions: {
          fullPayment: {
            enabled: true,
            amount: '$1,499.00'
          },
          depositPlusInstallments: {
            enabled: true,
            deposit: '$250.00',
            installments: 4,
            installmentAmount: '$312.25'
          }
        },
        capacity: {
          current: 0,
          max: 16
        },
        invitedTeams: ['U8G Gold'],
        // Derived fields for table display
        count: 0,
        totalCollected: '$0.00',
        outstanding: '$0.00',
        teams: 1,
        enabled: true
      }
    ],
    registrants: [
      // U18 Girls - 28 registrants (14 Gold, 14 Blue)
      {
        athlete: 'Emma Richardson',
        gender: 'Female',
        dob: 'Aug 12, 2007',
        primaryContact: 'Michael Richardson',
        email: 'michael.richardson@email.com',
        registration: 'U18 Girls',
        team: 'U18G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 5, 2025',
        orderId: 'ORD-1001',
        discount: {
          code: 'STAFF20',
          type: 'percentage',
          amount: 299.80,
          description: 'Staff Discount 20%'
        },
        totalFees: '$1,199.20',
        listPrice: '$1,499.00',
        totalPaid: '$0.00',
        refunded: '$0.00',
        outstanding: '$1,199.20',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 5, 2025', amount: '$0.00', originalAmount: '$250.00', discountApplied: 250.00, fees: '$0.00', refunded: '', transactionId: 'TXN-1001', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$262.45', originalAmount: '$312.25', discountApplied: 49.80, fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Olivia Martinez',
        gender: 'Female',
        dob: 'Sep 23, 2007',
        primaryContact: 'Jennifer Martinez',
        email: 'jennifer.martinez@email.com',
        registration: 'U18 Girls',
        team: 'U18G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 8, 2025',
        orderId: 'ORD-1002',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 8, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1002', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Sophia Chen',
        gender: 'Female',
        dob: 'Nov 5, 2007',
        primaryContact: 'David Chen',
        email: 'david.chen@email.com',
        registration: 'U18 Girls',
        team: 'U18G Blue',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 12, 2025',
        orderId: 'ORD-1003',
        discount: {
          code: 'EARLY10',
          type: 'percentage',
          amount: 149.90,
          description: 'Early Bird Discount 10%'
        },
        totalFees: '$1,349.10',
        listPrice: '$1,499.00',
        totalPaid: '$1,349.10',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 12, 2025', amount: '$1,349.10', originalAmount: '$1,499.00', discountApplied: 149.90, fees: '$0.00', refunded: '', transactionId: 'TXN-1007', status: 'Paid' }
        ]
      },
      // U17 Girls
      {
        athlete: 'Ava Thompson',
        gender: 'Female',
        dob: 'Jul 15, 2008',
        primaryContact: 'Lisa Thompson',
        email: 'lisa.thompson@email.com',
        registration: 'U17 Girls',
        team: 'U17G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 6, 2025',
        orderId: 'ORD-1004',
        discount: {
          code: 'FIXED200',
          type: 'fixed',
          amount: 200.00,
          description: 'Fixed $200 Discount'
        },
        totalFees: '$1,299.00',
        listPrice: '$1,499.00',
        totalPaid: '$50.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 6, 2025', amount: '$50.00', originalAmount: '$250.00', discountApplied: 200.00, fees: '$0.00', refunded: '', transactionId: 'TXN-1008', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Isabella Garcia',
        gender: 'Female',
        dob: 'Dec 20, 2008',
        primaryContact: 'Carlos Garcia',
        email: 'carlos.garcia@email.com',
        registration: 'U17 Girls',
        team: 'U17G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 10, 2025',
        orderId: 'ORD-1005',
        discount: {
          code: 'FIXED300',
          type: 'fixed',
          amount: 300.00,
          description: 'Fixed $300 Discount'
        },
        totalFees: '$1,199.00',
        listPrice: '$1,499.00',
        totalPaid: '$0.00',
        refunded: '$0.00',
        outstanding: '$1,199.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 10, 2025', amount: '$0.00', originalAmount: '$250.00', discountApplied: 250.00, fees: '$0.00', refunded: '', transactionId: 'TXN-1009', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$262.25', originalAmount: '$312.25', discountApplied: 50.00, fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // U16 Girls
      {
        athlete: 'Mia Rodriguez',
        gender: 'Female',
        dob: 'Aug 30, 2009',
        primaryContact: 'Maria Rodriguez',
        email: 'maria.rodriguez@email.com',
        registration: 'U16 Girls',
        team: 'U16G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 7, 2025',
        orderId: 'ORD-1006',
        discount: {
          code: 'EARLY10',
          type: 'percentage',
          amount: 149.90,
          description: 'Early Bird Discount 10%'
        },
        totalFees: '$1,349.10',
        listPrice: '$1,499.00',
        totalPaid: '$100.10',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 7, 2025', amount: '$100.10', originalAmount: '$250.00', discountApplied: 149.90, fees: '$0.00', refunded: '', transactionId: 'TXN-1014', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Charlotte Williams',
        gender: 'Female',
        dob: 'Feb 14, 2010',
        primaryContact: 'James Williams',
        email: 'james.williams@email.com',
        registration: 'U16 Girls',
        team: 'U16G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 11, 2025',
        orderId: 'ORD-1007',
        discount: {
          code: 'STAFF20',
          type: 'percentage',
          amount: 299.80,
          description: 'Staff Discount 20%'
        },
        totalFees: '$1,199.20',
        listPrice: '$1,499.00',
        totalPaid: '$0.00',
        refunded: '$0.00',
        outstanding: '$1,199.20',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 11, 2025', amount: '$0.00', originalAmount: '$250.00', discountApplied: 250.00, fees: '$0.00', refunded: '', transactionId: 'TXN-1015', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$262.45', originalAmount: '$312.25', discountApplied: 49.80, fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // U15 Girls
      {
        athlete: 'Amelia Johnson',
        gender: 'Female',
        dob: 'Oct 8, 2010',
        primaryContact: 'Robert Johnson',
        email: 'robert.johnson@email.com',
        registration: 'U15 Girls',
        team: 'U15G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 9, 2025',
        orderId: 'ORD-1008',
        discount: {
          code: 'FIXED300',
          type: 'fixed',
          amount: 300.00,
          description: 'Fixed $300 Discount'
        },
        totalFees: '$1,199.00',
        listPrice: '$1,499.00',
        totalPaid: '$0.00',
        refunded: '$0.00',
        outstanding: '$1,199.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 9, 2025', amount: '$0.00', originalAmount: '$250.00', discountApplied: 250.00, fees: '$0.00', refunded: '', transactionId: 'TXN-1020', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$262.25', originalAmount: '$312.25', discountApplied: 50.00, fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // U14 Girls
      {
        athlete: 'Harper Brown',
        gender: 'Female',
        dob: 'Sep 12, 2011',
        primaryContact: 'Sarah Brown',
        email: 'sarah.brown@email.com',
        registration: 'U14 Girls',
        team: 'U14G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 13, 2025',
        orderId: 'ORD-1009',
        discount: {
          code: 'STAFF20',
          type: 'percentage',
          amount: 299.80,
          description: 'Staff Discount 20%'
        },
        totalFees: '$1,199.20',
        listPrice: '$1,499.00',
        totalPaid: '$0.00',
        refunded: '$0.00',
        outstanding: '$1,199.20',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 13, 2025', amount: '$0.00', originalAmount: '$250.00', discountApplied: 250.00, fees: '$0.00', refunded: '', transactionId: 'TXN-1021', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$262.45', originalAmount: '$312.25', discountApplied: 49.80, fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Evelyn Davis',
        gender: 'Female',
        dob: 'Jan 25, 2012',
        primaryContact: 'Mark Davis',
        email: 'mark.davis@email.com',
        registration: 'U14 Girls',
        team: 'U14G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 14, 2025',
        orderId: 'ORD-1010',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 14, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1026', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // U13 Girls
      {
        athlete: 'Abigail Miller',
        gender: 'Female',
        dob: 'Nov 18, 2012',
        primaryContact: 'Patricia Miller',
        email: 'patricia.miller@email.com',
        registration: 'U13 Girls',
        team: 'U13G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 16, 2025',
        orderId: 'ORD-1011',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 16, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1027', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // U12 Girls
      {
        athlete: 'Ella Wilson',
        gender: 'Female',
        dob: 'Jul 22, 2013',
        primaryContact: 'Thomas Wilson',
        email: 'thomas.wilson@email.com',
        registration: 'U12 Girls',
        team: 'U12G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 17, 2025',
        orderId: 'ORD-1012',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 17, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1032', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Scarlett Moore',
        gender: 'Female',
        dob: 'Apr 5, 2014',
        primaryContact: 'Christopher Moore',
        email: 'christopher.moore@email.com',
        registration: 'U12 Girls',
        team: 'U12G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 18, 2025',
        orderId: 'ORD-1013',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 18, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1033', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // U11 Girls
      {
        athlete: 'Grace Taylor',
        gender: 'Female',
        dob: 'Sep 30, 2014',
        primaryContact: 'Daniel Taylor',
        email: 'daniel.taylor@email.com',
        registration: 'U11 Girls',
        team: 'U11G Gold',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 19, 2025',
        orderId: 'ORD-1014',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 19, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1038', status: 'Paid' }
        ]
      },
      // U10 Girls
      {
        athlete: 'Chloe Anderson',
        gender: 'Female',
        dob: 'Aug 14, 2015',
        primaryContact: 'Matthew Anderson',
        email: 'matthew.anderson@email.com',
        registration: 'U10 Girls',
        team: 'U10G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 20, 2025',
        orderId: 'ORD-1015',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 20, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1039', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Zoey Thomas',
        gender: 'Female',
        dob: 'Mar 28, 2016',
        primaryContact: 'Jessica Thomas',
        email: 'jessica.thomas@email.com',
        registration: 'U10 Girls',
        team: 'U10G Blue',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 21, 2025',
        orderId: 'ORD-1016',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 21, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1044', status: 'Paid' }
        ]
      },
      // U9 Girls
      {
        athlete: 'Lily Jackson',
        gender: 'Female',
        dob: 'Oct 10, 2016',
        primaryContact: 'Andrew Jackson',
        email: 'andrew.jackson@email.com',
        registration: 'U9 Girls',
        team: 'U9G Gold',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 22, 2025',
        orderId: 'ORD-1017',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 22, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1045', status: 'Paid' }
        ]
      },
      // U8 Girls
      {
        athlete: 'Layla White',
        gender: 'Female',
        dob: 'Dec 3, 2017',
        primaryContact: 'Kevin White',
        email: 'kevin.white@email.com',
        registration: 'U8 Girls',
        team: 'U8G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 23, 2025',
        orderId: 'ORD-1018',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 23, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1046', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // Additional U18 Girls registrants
      {
        athlete: 'Madison Lee',
        gender: 'Female',
        dob: 'Jan 10, 2008',
        primaryContact: 'Susan Lee',
        email: 'susan.lee@email.com',
        registration: 'U18 Girls',
        team: 'U18G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 9, 2025',
        orderId: 'ORD-1019',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 9, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1051', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Riley Harris',
        gender: 'Female',
        dob: 'May 20, 2008',
        primaryContact: 'Brian Harris',
        email: 'brian.harris@email.com',
        registration: 'U18 Girls',
        team: 'U18G Gold',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 11, 2025',
        orderId: 'ORD-1020',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 11, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1056', status: 'Paid' }
        ]
      },
      // Additional U17 Girls registrants
      {
        athlete: 'Aria Clark',
        gender: 'Female',
        dob: 'Mar 15, 2009',
        primaryContact: 'Nancy Clark',
        email: 'nancy.clark@email.com',
        registration: 'U17 Girls',
        team: 'U17G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 12, 2025',
        orderId: 'ORD-1021',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 12, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1057', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Hannah Lewis',
        gender: 'Female',
        dob: 'Jun 8, 2009',
        primaryContact: 'George Lewis',
        email: 'george.lewis@email.com',
        registration: 'U17 Girls',
        team: 'U17G Blue',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 13, 2025',
        orderId: 'ORD-1022',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 13, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1062', status: 'Paid' }
        ]
      },
      // Additional U16 Girls registrants
      {
        athlete: 'Addison Walker',
        gender: 'Female',
        dob: 'Nov 25, 2009',
        primaryContact: 'Steven Walker',
        email: 'steven.walker@email.com',
        registration: 'U16 Girls',
        team: 'U16G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 14, 2025',
        orderId: 'ORD-1023',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 14, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1063', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Natalie Hall',
        gender: 'Female',
        dob: 'Apr 18, 2010',
        primaryContact: 'Rachel Hall',
        email: 'rachel.hall@email.com',
        registration: 'U16 Girls',
        team: 'U16G Blue',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 15, 2025',
        orderId: 'ORD-1024',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 15, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1068', status: 'Paid' }
        ]
      },
      // Additional U14 Girls registrants
      {
        athlete: 'Brooklyn Allen',
        gender: 'Female',
        dob: 'Feb 28, 2012',
        primaryContact: 'Michelle Allen',
        email: 'michelle.allen@email.com',
        registration: 'U14 Girls',
        team: 'U14G Gold',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 16, 2025',
        orderId: 'ORD-1025',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 16, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1069', status: 'Paid' }
        ]
      },
      {
        athlete: 'Penelope Young',
        gender: 'Female',
        dob: 'May 12, 2012',
        primaryContact: 'Timothy Young',
        email: 'timothy.young@email.com',
        registration: 'U14 Girls',
        team: 'U14G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 17, 2025',
        orderId: 'ORD-1026',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 17, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1070', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      // Additional U12 Girls registrants
      {
        athlete: 'Victoria King',
        gender: 'Female',
        dob: 'Oct 5, 2013',
        primaryContact: 'Brandon King',
        email: 'brandon.king@email.com',
        registration: 'U12 Girls',
        team: 'U12G Gold',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 18, 2025',
        orderId: 'ORD-1027',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 18, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1075', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      },
      {
        athlete: 'Camila Wright',
        gender: 'Female',
        dob: 'Jan 30, 2014',
        primaryContact: 'Angela Wright',
        email: 'angela.wright@email.com',
        registration: 'U12 Girls',
        team: 'U12G Blue',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 19, 2025',
        orderId: 'ORD-1028',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 19, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1080', status: 'Paid' }
        ]
      },
      // Additional U10 Girls registrants
      {
        athlete: 'Aubrey Lopez',
        gender: 'Female',
        dob: 'Dec 9, 2015',
        primaryContact: 'Jason Lopez',
        email: 'jason.lopez@email.com',
        registration: 'U10 Girls',
        team: 'U10G Gold',
        paymentPlan: 'Full Payment',
        registrationDate: 'Oct 20, 2025',
        orderId: 'ORD-1029',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$1,499.00',
        refunded: '$0.00',
        outstanding: '$0.00',
        status: 'Paid',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Full Payment', date: 'Oct 20, 2025', amount: '$1,499.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1081', status: 'Paid' }
        ]
      },
      {
        athlete: 'Savannah Hill',
        gender: 'Female',
        dob: 'Feb 20, 2016',
        primaryContact: 'Amanda Hill',
        email: 'amanda.hill@email.com',
        registration: 'U10 Girls',
        team: 'U10G Blue',
        paymentPlan: 'Deposit + Installments',
        registrationDate: 'Oct 21, 2025',
        orderId: 'ORD-1030',
        totalFees: '$1,499.00',
        listPrice: '$1,499.00',
        totalPaid: '$250.00',
        refunded: '$0.00',
        outstanding: '$1,249.00',
        status: 'Current',
        paymentPlanStatus: 'Active',
        payments: [
          { description: 'Deposit', date: 'Oct 21, 2025', amount: '$250.00', fees: '$0.00', refunded: '', transactionId: 'TXN-1082', status: 'Paid' },
          { description: 'Installment 1 of 4', date: 'Aug 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 2 of 4', date: 'Sep 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 3 of 4', date: 'Oct 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' },
          { description: 'Installment 4 of 4', date: 'Nov 10, 2026', amount: '$312.25', fees: '', refunded: '', transactionId: '', status: 'Scheduled' }
        ]
      }
      // Waitlisted registrants removed - tab will show empty
    ]
  };

  // Calculate registration statistics from registrants
  const calculateRegistrationStats = (registrations, registrants) => {
    return registrations.map(reg => {
      const regRegistrants = registrants.filter(r => r.registration === reg.title);
      const count = regRegistrants.length;
      // Preserve waitlistOpen if it exists, otherwise default to false
      const waitlistOpen = reg.waitlistOpen !== undefined ? reg.waitlistOpen : false;
      const totalPaid = regRegistrants.reduce((sum, r) => {
        const amount = parseFloat(r.totalPaid.replace(/[$,]/g, ''));
        return sum + amount;
      }, 0);
      const totalOutstanding = regRegistrants.reduce((sum, r) => {
        const amount = parseFloat(r.outstanding.replace(/[$,]/g, ''));
        return sum + amount;
      }, 0);
      const totalRefunded = regRegistrants.reduce((sum, r) => {
        const amount = parseFloat(r.refunded.replace(/[$,]/g, ''));
        return sum + amount;
      }, 0);
      const totalDiscounts = regRegistrants.reduce((sum, r) => {
        const amount = r.discount ? r.discount.amount : 0;
        return sum + amount;
      }, 0);

      // Gross total paid (refunds shown separately)
      return {
        ...reg,
        count,
        waitlistOpen,
        totalCollected: `$${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        refunded: `$${totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        discounts: `$${totalDiscounts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        outstanding: `$${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        capacity: {
          current: count,
          max: reg.capacity.max
        }
      };
    });
  };

  // Helper function to calculate widget data for a set of registrants
  const calculateWidgetData = (registrants) => {
    const totalPaid = registrants.reduce((sum, r) => {
      const amount = parseFloat(r.totalPaid.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

    const totalOutstanding = registrants.reduce((sum, r) => {
      const amount = parseFloat(r.outstanding.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

    const totalRefunded = registrants.reduce((sum, r) => {
      const amount = parseFloat(r.refunded.replace(/[$,]/g, ''));
      return sum + amount;
    }, 0);

    const totalDiscounts = registrants.reduce((sum, r) => {
      const amount = r.discount ? r.discount.amount : 0;
      return sum + amount;
    }, 0);

    const totalFees = totalPaid + totalOutstanding;

    return {
      totalFees,
      totalPaid,
      totalOutstanding,
      totalRefunded,
      totalDiscounts,
      count: registrants.length
    };
  };

  // Calculate initial registration stats (only used for initial state)
  const registrationsWithStats = calculateRegistrationStats(initialMockData.registrations, initialMockData.registrants);

  // State for registrations that can be toggled
  const [registrations, setRegistrations] = useState(registrationsWithStats);

  // Initialize registrants data on component mount
  React.useEffect(() => {
    if (registrantsData === null) {
      setRegistrantsData(initialMockData.registrants);
    }
  }, []);

  // Check if any registration is enabled - this determines the master toggle state
  const hasOpenRegistrations = registrations.some(reg => reg.enabled);
  
  // Waitlist toggle state
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  
  // Waitlist tab state
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showInviteDrawer, setShowInviteDrawer] = useState(false);
  const [invitedAthletes, setInvitedAthletes] = useState(new Set());
  const [waitlistSearchQuery, setWaitlistSearchQuery] = useState('');
  const [waitlistStatusFilter, setWaitlistStatusFilter] = useState('All');
  const [isClosingWaitlist, setIsClosingWaitlist] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [showAthleteDrawer, setShowAthleteDrawer] = useState(false);

  // Waitlist athletes data with full details
  const waitlistAthletesData = [
    { 
      name: 'Emma Richardson', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Nov 1, 2025', 
      dob: 'Aug 12, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Michael Richardson', familyEmail: 'michael.richardson@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Waitlist', dateRegistered: 'Aug 15, 2024' },
        { program: 'U17 Girls', season: '2023-2024', status: 'Completed', dateRegistered: 'Aug 10, 2023' }
      ]
    },
    { 
      name: 'Olivia Martinez', age: 17, gender: 'Female', program: 'U18 Girls', dateAdded: 'Nov 1, 2025', 
      dob: 'Sep 23, 2007', grade: '11th Grade', graduationYear: '2026', 
      familyName: 'Jennifer Martinez', familyEmail: 'jennifer.martinez@email.com',
      registrationHistory: [
        { program: 'U18 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Aug 20, 2024' },
        { program: 'U17 Girls', season: '2023-2024', status: 'Completed', dateRegistered: 'Aug 12, 2023' }
      ]
    },
    { 
      name: 'Ava Garcia', age: 16, gender: 'Female', program: 'U17 Girls', dateAdded: 'Nov 2, 2025', 
      dob: 'Mar 15, 2008', grade: '10th Grade', graduationYear: '2027', 
      familyName: 'Robert Garcia', familyEmail: 'robert.garcia@email.com',
      registrationHistory: [
        { program: 'U17 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 1, 2024' }
      ]
    },
    { 
      name: 'Sophia Johnson', age: 15, gender: 'Female', program: 'U16 Girls', dateAdded: 'Nov 3, 2025', 
      dob: 'Jun 20, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'Sarah Johnson', familyEmail: 'sarah.johnson@email.com',
      registrationHistory: [
        { program: 'U16 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 5, 2024' }
      ]
    },
    { 
      name: 'Isabella Williams', age: 14, gender: 'Female', program: 'U15 Girls', dateAdded: 'Nov 4, 2025', 
      dob: 'Dec 5, 2009', grade: '9th Grade', graduationYear: '2028', 
      familyName: 'David Williams', familyEmail: 'david.williams@email.com',
      registrationHistory: [
        { program: 'U15 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 8, 2024' }
      ]
    },
    { 
      name: 'Mia Brown', age: 13, gender: 'Female', program: 'U14 Girls', dateAdded: 'Nov 5, 2025', 
      dob: 'Feb 10, 2010', grade: '8th Grade', graduationYear: '2029', 
      familyName: 'Lisa Brown', familyEmail: 'lisa.brown@email.com',
      registrationHistory: [
        { program: 'U14 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 10, 2024' }
      ]
    },
    { 
      name: 'Charlotte Davis', age: 12, gender: 'Female', program: 'U13 Girls', dateAdded: 'Nov 6, 2025', 
      dob: 'Apr 22, 2011', grade: '7th Grade', graduationYear: '2030', 
      familyName: 'James Davis', familyEmail: 'james.davis@email.com',
      registrationHistory: [
        { program: 'U13 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 12, 2024' }
      ]
    },
    { 
      name: 'Amelia Miller', age: 11, gender: 'Female', program: 'U12 Girls', dateAdded: 'Nov 7, 2025', 
      dob: 'Jul 8, 2012', grade: '6th Grade', graduationYear: '2031', 
      familyName: 'Patricia Miller', familyEmail: 'patricia.miller@email.com',
      registrationHistory: [
        { program: 'U12 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 15, 2024' }
      ]
    },
    { 
      name: 'Harper Wilson', age: 10, gender: 'Female', program: 'U11 Girls', dateAdded: 'Nov 8, 2025', 
      dob: 'Oct 30, 2012', grade: '5th Grade', graduationYear: '2032', 
      familyName: 'Christopher Wilson', familyEmail: 'christopher.wilson@email.com',
      registrationHistory: [
        { program: 'U11 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 18, 2024' }
      ]
    },
    { 
      name: 'Evelyn Moore', age: 9, gender: 'Female', program: 'U10 Girls', dateAdded: 'Nov 9, 2025', 
      dob: 'Jan 18, 2013', grade: '4th Grade', graduationYear: '2033', 
      familyName: 'Barbara Moore', familyEmail: 'barbara.moore@email.com',
      registrationHistory: [
        { program: 'U10 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 20, 2024' }
      ]
    },
    { 
      name: 'Abigail Taylor', age: 8, gender: 'Female', program: 'U9 Girls', dateAdded: 'Nov 10, 2025', 
      dob: 'May 3, 2014', grade: '3rd Grade', graduationYear: '2034', 
      familyName: 'Daniel Taylor', familyEmail: 'daniel.taylor@email.com',
      registrationHistory: [
        { program: 'U9 Girls', season: '2024-2025', status: 'Active', dateRegistered: 'Sep 22, 2024' }
      ]
    }
  ];

  const waitlistAthletes = waitlistAthletesData.map(a => a.name);

  // Get selected athlete names
  const getSelectedAthleteNames = () => {
    const selectedNames = Array.from(selectedRows)
      .sort((a, b) => a - b)
      .map(index => waitlistAthletes[index])
      .filter(name => name); // Remove any undefined entries
    
    return selectedNames.length > 0 
      ? selectedNames.join(', ')
      : '';
  };

  // Define tabs array for PageHeader
  const pageTabs = ['overview', 'registrations'];

  // Handler for master toggle (in PageHeader)
  const handleMasterToggle = () => {
    // If any registrations are open, close all. If all are closed, open all.
    const newValue = !hasOpenRegistrations;
    
    
    // Update all registrations on both overview and registrations tabs
    setRegistrations(registrations.map(reg => ({
      ...reg,
      enabled: newValue
    })));
    
    // Show toast with plural message
    const message = `All registrations ${newValue ? 'opened' : 'closed'}`;
    setToastMessage(message);
  };


  // Handler for waitlist toggle
  const handleWaitlistToggle = () => {
    const newValue = !waitlistOpen;
    if (!newValue) {
      // Toggling off - open drawer with "Close Waitlist" title
      setIsClosingWaitlist(true);
      setShowInviteDrawer(true);
    } else {
      // Toggling on - just update state
      setWaitlistOpen(newValue);
      setToastMessage('Waitlists opened');
    }
  };

  // Handler for waitlist toggle on registrations table
  const handleRegistrationWaitlistToggle = (registration, index) => {
    const currentWaitlistOpen = registrations[index].waitlistOpen;
    
    setRegistrations(registrations.map((reg, i) => 
      i === index ? { ...reg, waitlistOpen: !reg.waitlistOpen } : reg
    ));
    
    // Show toast
    setToastMessage(`${registration.title} waitlist ${!currentWaitlistOpen ? 'opened' : 'closed'}`);
  };

  // Handler for individual registration toggle
  const handleIndividualToggle = (registration, index) => {
    const currentEnabled = registrations[index].enabled;
    
    setRegistrations(registrations.map((reg, i) => 
      i === index ? { ...reg, enabled: !reg.enabled } : reg
    ));
    
    // Show toast with registration name and action
    const action = !currentEnabled ? 'opened' : 'closed';
    const message = `${registration.title} registration ${action}`;
    setToastMessage(message);
  };

  // Initialize registrants data if not already set
  const currentRegistrants = registrantsData || initialMockData.registrants;

  // Calculate widget totals from current registrants (for program overview)
  const programWidgetData = calculateWidgetData(currentRegistrants);
  
  // Debug logging

  const updatedWidgets = initialMockData.widgets.map(widget => {
    if (widget.label === "Registrants") {
      // Calculate completed registrants count (those with zero outstanding balance)
      const completedCount = currentRegistrants.filter(registrant => registrant.outstanding === "$0.00").length;

      return {
        ...widget,
        value: programWidgetData.count.toString(),
        rows: widget.rows.map(row => {
          if (row.label === "Completed") {
            return {
              ...row,
              value: completedCount.toString()
            };
          }
          return row;
        })
      };
    }
    if (widget.label === "Total Fees") {
      // Accrual accounting: Paid to Date + Outstanding - Refunded
      const grossValue = programWidgetData.totalPaid + programWidgetData.totalOutstanding - programWidgetData.totalRefunded;

      return {
        ...widget,
        label: "Total Program Value",
        value: `$${grossValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        labelTooltip: "Sum of paid to date and outstanding less refunds",
        rows: [
          { label: "Paid to Date", value: `$${programWidgetData.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, hasButton: false, showCopyButton: false },
          { label: "Outstanding", value: `$${programWidgetData.totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, hasButton: false, showCopyButton: false },
          { label: "Refunded", value: `($${programWidgetData.totalRefunded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`, hasButton: false, showCopyButton: false }
        ]
      };
    }
    return widget;
  });

  // Refund handler
  const handleRefund = ({ amount, note, payment }) => {
    const refundAmount = parseFloat(amount);
    
    // Update registrants data
    const updatedRegistrants = currentRegistrants.map(registrant => {
      // Find if this registrant has the payment
      const paymentIndex = registrant.payments.findIndex(p => 
        p.description === payment.description && 
        p.date === payment.date && 
        p.transactionId === payment.transactionId
      );
      
      if (paymentIndex === -1) return registrant;
      
      // Update the payment
      const updatedPayments = [...registrant.payments];
      const currentPayment = updatedPayments[paymentIndex];
      const paymentAmount = parseFloat(currentPayment.amount.replace(/[$,]/g, ''));
      const currentRefunded = parseFloat(currentPayment.refunded?.replace(/[$,]/g, '') || '0');
      const newRefundedAmount = currentRefunded + refundAmount;
      
      // Determine status
      let newStatus;
      if (newRefundedAmount >= paymentAmount) {
        newStatus = 'Refunded';
      } else if (newRefundedAmount > 0) {
        newStatus = 'Partially Refunded';
      } else {
        newStatus = currentPayment.status;
      }
      
      updatedPayments[paymentIndex] = {
        ...currentPayment,
        refunded: `$${newRefundedAmount.toFixed(2)}`,
        status: newStatus
      };
      
      // Recalculate registrant's total refunded
      const totalRefunded = updatedPayments.reduce((sum, p) => {
        const refunded = parseFloat(p.refunded?.replace(/[$,]/g, '') || '0');
        return sum + refunded;
      }, 0);
      
      // Determine registrant status based on outstanding balance (not refund status)
      // Account status is about what they owe, refunds are shown separately
      const newOutstanding = parseFloat(registrant.outstanding.replace(/[$,]/g, ''));
      const totalPaidAmount = parseFloat(registrant.totalPaid.replace(/[$,]/g, ''));
      const listPriceAmount = parseFloat(registrant.listPrice.replace(/[$,]/g, ''));
      let registrantStatus;

      // Account status is based on outstanding balance
      if (newOutstanding === 0) {
        // If they owe nothing, they're paid (whether by full payment or plan cancellation)
        registrantStatus = 'Paid';
      } else if (registrant.status === 'Overdue') {
        // Preserve overdue status if it was already set
        registrantStatus = 'Overdue';
      } else {
        // Otherwise they're current
        registrantStatus = 'Current';
      }
      
      return {
        ...registrant,
        payments: updatedPayments,
        refunded: `$${totalRefunded.toFixed(2)}`,
        status: registrantStatus,
        paymentPlanStatus: registrant.paymentPlanStatus
      };
    });
    
    setRegistrantsData(updatedRegistrants);
  };


  // Cancel handler
  const handleCancel = ({ reason, payment }) => {
    // Update registrants data to mark payment as cancelled and recalculate outstanding
    const updatedRegistrants = currentRegistrants.map(registrant => {
      // Find if this registrant has the payment
      const paymentIndex = registrant.payments.findIndex(p => 
        p.description === payment.description && 
        p.date === payment.date && 
        p.transactionId === payment.transactionId
      );
      
      if (paymentIndex === -1) return registrant;
      
      // Update the payment status to Canceled
      const updatedPayments = [...registrant.payments];
      updatedPayments[paymentIndex] = {
        ...updatedPayments[paymentIndex],
        status: 'Canceled'
      };
      
      // Recalculate outstanding: sum of scheduled payments only (exclude cancelled and paid)
      const newOutstanding = updatedPayments.reduce((sum, p) => {
        if (p.status === 'Scheduled') {
          const amount = parseFloat(p.amount.replace(/[$,]/g, ''));
          return sum + amount;
        }
        return sum;
      }, 0);
      
      // Determine registrant status
      // Priority: Canceled > Refunded > Partially Refunded > Paid/Current
      const totalPaidAmount = parseFloat(registrant.totalPaid.replace(/[$,]/g, ''));
      const totalRefunded = parseFloat(registrant.refunded.replace(/[$,]/g, ''));
      const listPriceAmount = parseFloat(registrant.listPrice.replace(/[$,]/g, ''));
      
      let registrantStatus;
      
      if (newOutstanding === 0 && totalPaidAmount < listPriceAmount) {
        // Canceled status takes priority even if they have refunds
        registrantStatus = 'Canceled';
      } else if (totalRefunded >= totalPaidAmount && totalRefunded > 0) {
        registrantStatus = 'Refunded';
      } else if (totalRefunded > 0) {
        registrantStatus = 'Partially Refunded';
      } else if (newOutstanding === 0 && totalPaidAmount >= listPriceAmount) {
        registrantStatus = 'Paid';
      } else {
        registrantStatus = 'Current';
      }
      
      return {
        ...registrant,
        payments: updatedPayments,
        outstanding: `$${newOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: registrantStatus
      };
    });
    
    setRegistrantsData(updatedRegistrants);
  };

  // Cancel Plan handler - cancels selected scheduled payments for a registrant
  const handleCancelPlan = ({ registrant, scheduledPayments, note }) => {
    // Update registrants data to mark selected scheduled payments as cancelled
    const updatedRegistrants = currentRegistrants.map(r => {
      // Only update the specific registrant
      if (r.athlete !== registrant.athlete || r.orderId !== registrant.orderId) {
        return r;
      }
      
      // Mark only the selected scheduled payments as Canceled
      const updatedPayments = r.payments.map(payment => {
        const isSelected = scheduledPayments.some(sp => 
          sp.description === payment.description && 
          sp.date === payment.date && 
          sp.transactionId === payment.transactionId
        );
        
        if (isSelected && payment.status === 'Scheduled') {
          return {
            ...payment,
            status: 'Canceled'
          };
        }
        return payment;
      });
      
      // Recalculate outstanding: sum of remaining scheduled payments
      const newOutstanding = updatedPayments.reduce((sum, p) => {
        if (p.status === 'Scheduled') {
          const amount = parseFloat(p.amount.replace(/[$,]/g, ''));
          return sum + amount;
        }
        return sum;
      }, 0);
      
      // Determine registrant status
      // Account status is based on what they owe, not plan status
      const totalPaidAmount = parseFloat(r.totalPaid.replace(/[$,]/g, ''));
      const totalRefunded = parseFloat(r.refunded.replace(/[$,]/g, ''));

      let registrantStatus;

      // If outstanding is 0, account is completed (whether by full payment or plan cancellation)
      if (newOutstanding === 0) {
        registrantStatus = 'Paid';
      } else if (totalRefunded >= totalPaidAmount && totalRefunded > 0) {
        registrantStatus = 'Refunded';
      } else if (totalRefunded > 0) {
        registrantStatus = 'Partially Refunded';
      } else {
        registrantStatus = 'Current';
      }
      
      return {
        ...r,
        payments: updatedPayments,
        outstanding: `$${newOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: registrantStatus,
        paymentPlanStatus: 'Canceled',
        outstandingReason: newOutstanding === 0 ? 'canceled' : null
      };
    });
    
    setRegistrantsData(updatedRegistrants);
  };

  // Edit Payment handler - updates the scheduled date of a payment
  const handleEditPayment = ({ payment, date, originalDate, note, registrant }) => {
    // Update registrants data to change the payment date for only the specific registrant
    const updatedRegistrants = currentRegistrants.map(r => {
      // Only update if this is the specific registrant we're editing
      if (r.orderId !== registrant.orderId) return r;

      // Find the payment in this registrant
      const paymentIndex = r.payments.findIndex(p =>
        p.description === payment.description &&
        p.date === originalDate &&
        p.transactionId === payment.transactionId &&
        p.status === 'Scheduled'
      );

      if (paymentIndex === -1) return r;

      // Update the payment date and store modification metadata
      const updatedPayments = [...r.payments];
      const currentPayment = updatedPayments[paymentIndex];
      updatedPayments[paymentIndex] = {
        ...currentPayment,
        date: date,
        originalDate: originalDate, // Store original date for reference
        modifiedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), // When it was modified
        modifiedNote: note || undefined, // Store the note if provided
        isModified: true // Flag to indicate this payment was modified
      };

      return {
        ...r,
        payments: updatedPayments
      };
    });

    setRegistrantsData(updatedRegistrants);
  };

  // Check if a registrant has overdue payments
  const isOverdue = (registrant) => {
    if (!registrant.payments || registrant.payments.length === 0) {
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
    
    return registrant.payments.some(payment => {
      if (payment.status === 'Scheduled') {
        const paymentDate = new Date(payment.date);
        return paymentDate < today;
      }
      return false;
    });
  };

  // Update registrant status to Overdue if they have past-due payments
  const updateOverdueStatuses = (registrants) => {
    return registrants.map(registrant => {
      if (isOverdue(registrant) && registrant.status === 'Current') {
        return { ...registrant, status: 'Overdue' };
      }
      return registrant;
    });
  };

  // Filter registrants by status
  const filterByStatus = (registrants, filter) => {
    if (filter === 'All') {
      return registrants;
    }

    return registrants.filter(registrant => {
      switch (filter) {
        case 'Current':
          return registrant.status === 'Current';
        case 'Overdue':
          return registrant.status === 'Overdue';
        case 'Completed':
          return registrant.status === 'Paid';
        case 'Refunded':
          // Show anyone with refunds > $0, regardless of status
          const refundAmount = parseFloat((registrant.refunded || '$0.00').replace(/[$,]/g, ''));
          return refundAmount > 0;
        case 'Canceled':
          return registrant.paymentPlanStatus === 'Canceled';
        default:
          return true;
      }
    });
  };

  // Filter registrants based on search query
  const filterBySearch = (registrants, query) => {
    if (!query || query.trim() === '') {
      return registrants;
    }
    
    const lowerQuery = query.toLowerCase().trim();
    
    return registrants.filter(registrant => {
      // Split athlete name into parts (first name, last name)
      const athleteParts = registrant.athlete.toLowerCase().split(' ');
      
      // Split primary contact name into parts (first name, last name)
      const contactParts = registrant.primaryContact.toLowerCase().split(' ');
      
      // Check if any part of athlete name matches
      const athleteMatch = athleteParts.some(part => part.includes(lowerQuery));
      
      // Check if any part of primary contact name matches
      const contactMatch = contactParts.some(part => part.includes(lowerQuery));
      
      return athleteMatch || contactMatch;
    });
  };

  // Apply overdue status updates first
  const registrantsWithOverdue = updateOverdueStatuses(currentRegistrants);

  // Apply status filter, then search filter
  const statusFiltered = filterByStatus(registrantsWithOverdue, filterValue);
  const fullyFilteredRegistrants = filterBySearch(statusFiltered, searchQuery);

  // Sort by registration date (newest to oldest)
  const sortedRegistrants = [...fullyFilteredRegistrants].sort((a, b) => {
    const dateA = new Date(a.registrationDate);
    const dateB = new Date(b.registrationDate);
    return dateB - dateA; // Reverse chronological order (newest first)
  });

  // Recalculate registration stats from full dataset (do not apply table filters)
  const updatedRegistrationsWithStats = calculateRegistrationStats(registrations, currentRegistrants);

  // Use mock data with stateful registrations and filtered registrants (filters only affect the registrants table)
  const mockData = {
    ...initialMockData,
    widgets: updatedWidgets,
    registrations: updatedRegistrationsWithStats,
    registrants: sortedRegistrants
  };

  // If a registrant is selected, show registrant details
  if (selectedRegistrant) {
    // Determine breadcrumb and back behavior based on whether we came from a registration page
    const breadcrumb = selectedRegistration ? selectedRegistration.title : "2024-2025 Club Dues";
    const handleBack = () => {
      setSelectedRegistrant(null);
      if (!selectedRegistration) {
        setActiveTab(previousTab);
      }
      // If selectedRegistration exists, we stay on that page (don't need to do anything else)
    };

    // Find the current registrant data (might be updated)
    const currentRegistrantData = currentRegistrants.find(r => 
      r.athlete === selectedRegistrant.athlete && 
      r.orderId === selectedRegistrant.orderId
    ) || selectedRegistrant;

    return (
      <RegistrantDetails
        registrant={currentRegistrantData}
        breadcrumbText={breadcrumb}
        onBack={handleBack}
        onRefund={handleRefund}
        onCancel={handleCancel}
        onCancelPlan={handleCancelPlan}
        onEditPayment={handleEditPayment}
      />
    );
  }

  // If a registration is selected, show the detail view
  if (selectedRegistration) {
    // Find the current state of this registration
    const currentRegistration = registrations.find(r => r.title === selectedRegistration.title);
    
    // Calculate widget data for this specific registration (do not use table filters)
    // Preserve overdue status but ignore search/filter applied to registrants table
    const baseRegistrants = registrantsWithOverdue;
    const registrationRegistrants = baseRegistrants.filter(r => r.registration === selectedRegistration.title);
    const registrationWidgetData = calculateWidgetData(registrationRegistrants);
    
    return (
      <RegistrationOverview
        registration={{
          title: selectedRegistration.title,
          subtitle: 'Jan 15, 2025 - Jul 15, 2025',
          enabled: currentRegistration?.enabled ?? true,
          invitedTeams: currentRegistration?.invitedTeams ?? []
        }}
        widgetData={registrationWidgetData}
        breadcrumbText="2024-2025 Club Dues"
        onBack={() => {
          setSelectedRegistration(null);
          setActiveTab(previousTab);
        }}
        onToggleChange={() => {
          // Find index and toggle this specific registration
          const index = registrations.findIndex(r => r.title === selectedRegistration.title);
          if (index !== -1) {
            handleIndividualToggle(registrations[index], index);
          }
        }}
        onRegistrantClickFromHere={(registrant) => {
          setSelectedRegistrant(registrant);
          // Keep selectedRegistration set so we know to come back here
        }}
        widgets={mockData.widgets}
        registrants={registrationRegistrants}
      />
    );
  }

  return (
    <>
      <style>
        {`
          .mock-dashboard-main {
            background-color: white;
            padding: 28px 64px;
            display: flex;
            flex-direction: column;
            gap: var(--u-space-two, 32px);
          }

          .mock-dashboard-widgets {
            display: flex;
            gap: var(--u-space-three, 48px);
          }

          /* S breakpoint (288px - 767px) - Mobile/Small */
          @media (min-width: 288px) and (max-width: 767px) {
            .mock-dashboard-main {
              padding: 16px;
            }

            .mock-dashboard-widgets {
              flex-direction: column;
              gap: var(--u-space-one-half, 24px);
            }
          }
        `}
      </style>
      <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        {/* Main Content Area */}
        <main className="mock-dashboard-main">
        {/* Page Header */}
        <PageHeader 
          title="2024-2025 Club Dues"
          subtitle="Team Dues · Jan 15, 2025 - Jul 15, 2025"
          showBreadcrumbs={true}
          showTabs={true}
          tabs={pageTabs}
          showToggle={false}
          isPrivate={true}
          showShare={true}
          onShare={() => setShowShareModal(true)}
          onMore={() => {}}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          shareDisabled={!hasOpenRegistrations}
        />

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
        {/* Data Widgets */}
        <div className="mock-dashboard-widgets">
          {mockData.widgets.map((widget, index) => (
            <DataWidget
              key={index}
              label={widget.label}
              value={widget.value}
              size={widget.size}
              avatar={widget.avatar}
              subheader={widget.subheader}
              rows={widget.rows}
              labelTooltip={widget.labelTooltip}
              onRowButtonClick={(rowIndex, row) => {
                alert(`Clicked: ${widget.label} > ${row.label} (${row.value})`);
              }}
            />
          ))}
        </div>

            {/* Registrants Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-half, 8px)' }}>
              <TableToolbar
                title="Registrants"
                filterValue={filterValue}
                onFilterChange={setFilterValue}
                onSearch={(value) => setSearchQuery(value)}
                onDownload={() => {}}
              />
              <RegistrantsTable 
                registrants={mockData.registrants}
                onRegistrantClick={(registrant) => {
                  setPreviousTab(activeTab);
                  setSelectedRegistrant(registrant);
                }}
              />
        </div>
          </>
        )}

        {/* Registrations Tab Content */}
        {activeTab === 'registrations' && (
          <RegistrationsTable
            registrations={mockData.registrations}
            onToggleRegistration={handleIndividualToggle}
            onToggleWaitlist={handleRegistrationWaitlistToggle}
            onRegistrationClick={(registration) => {
              setPreviousTab(activeTab);
              setSelectedRegistration(registration);
            }}
          />
        )}
      </main>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          duration={3000}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        programTitle="2024-2025 Club Dues"
        programUrl="https://fan.hudl.com/org/82315/program/T3JnYW5pemF0aW9uOjgyMzE1"
      />

      {/* Invite Drawer */}
      {showInviteDrawer && (
        <>
          <div
            className="invite-drawer-overlay"
            onClick={() => {
              setShowInviteDrawer(false);
              setIsClosingWaitlist(false);
            }}
          />
          <div className="invite-drawer">
            <style>
              {`
                .invite-drawer-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 9998;
                  animation: fadeIn 0.2s ease;
                }

                .invite-drawer {
                  position: fixed;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 600px;
                  max-width: 90vw;
                  background-color: var(--u-color-background-container, #fefefe);
                  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
                  z-index: 9999;
                  display: flex;
                  flex-direction: column;
                  animation: slideInRight 0.3s ease;
                  overflow: hidden;
                }

                @keyframes slideInRight {
                  from {
                    transform: translateX(100%);
                  }
                  to {
                    transform: translateX(0);
                  }
                }

                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }

                .invite-drawer-content {
                  flex: 1;
                  overflow-y: auto;
                  padding: var(--u-space-one-and-half, 24px);
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one-and-half, 24px);
                }

                .invite-drawer-header {
                  position: sticky;
                  top: 0;
                  background-color: var(--u-color-background-container, #fefefe);
                  z-index: 10;
                  padding-bottom: var(--u-space-one-and-half, 24px);
                  margin-bottom: calc(-1 * var(--u-space-one-and-half, 24px));
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-half, 8px);
                }

                .invite-drawer-header-top {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                }

                .invite-drawer-close-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                  margin-top: -4px;
                  margin-right: -4px;
                }

                .invite-drawer-close-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }

                .invite-drawer-footer {
                  position: sticky;
                  bottom: 0;
                  background-color: var(--u-color-background-container, #fefefe);
                  border-top: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
                  z-index: 10;
                  display: flex;
                  justify-content: flex-end;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-title {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.2;
                  color: var(--u-color-base-foreground-contrast, #071c31);
                  margin: 0;
                }

                .invite-drawer-description {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-small, 14px);
                  line-height: 1.4;
                  color: var(--u-color-base-foreground, #36485c);
                  margin: 0;
                  margin-top: var(--u-space-half, 8px);
                }

                .invite-drawer-form {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-three-quarter, 12px);
                }

                .invite-drawer-field {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-quarter, 4px);
                }

                .invite-drawer-label {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1;
                  color: var(--u-color-base-foreground, #36485c);
                  display: flex;
                  gap: var(--u-space-eighth, 2px);
                  align-items: center;
                }

                .invite-drawer-label-required {
                  color: var(--u-color-alert-foreground, #bb1700);
                }

                .invite-drawer-input {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  padding: 0 var(--u-space-one, 16px);
                  min-height: 40px;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  opacity: 1;
                }

                .invite-drawer-input:focus {
                  outline: none;
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                  opacity: 1;
                }

                .invite-drawer-input[readonly] {
                  background-color: var(--u-color-background-callout, #f8f8f9);
                  opacity: 0.8;
                }

                .invite-drawer-help-text {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-micro, 12px);
                  line-height: 1.4;
                  color: var(--u-color-content-subtle, #506277);
                  margin: 0;
                }

                .invite-drawer-textarea-wrapper {
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  display: flex;
                  flex-direction: column;
                  height: 350px;
                }

                .invite-drawer-toolbar {
                  display: flex;
                  gap: var(--u-space-small, 4px);
                  align-items: center;
                  padding: var(--u-space-quarter, 4px) var(--u-space-one, 16px);
                  border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
                }

                .invite-drawer-textarea {
                  flex: 1;
                  padding: var(--u-space-one, 16px);
                  font-family: 'Helvetica', sans-serif;
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.5;
                  color: #13293f;
                  border: none;
                  outline: none;
                  resize: none;
                  overflow-y: auto;
                }

                .invite-drawer-select {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  padding: 0 var(--u-space-one, 16px);
                  min-height: 40px;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  opacity: 1;
                  cursor: pointer;
                }

                .invite-drawer-select:focus {
                  outline: none;
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                  opacity: 1;
                }
              `}
            </style>
            <div className="invite-drawer-content">
              <div className="invite-drawer-header">
                <div className="invite-drawer-header-top">
                  <div style={{ flex: 1 }}>
                    <h2 className="invite-drawer-title">
                      {isClosingWaitlist ? 'Close Waitlists' : 'Compose Your Message'}
                    </h2>
                    <p className="invite-drawer-description">
                      {isClosingWaitlist 
                        ? 'You are about to close this program\'s waitlists. Athletes will no longer be able to sign up for this program.'
                        : 'Selected athletes will receive an email invitation that they are off the waitlist.'}
                    </p>
                  </div>
                  <button
                    className="invite-drawer-close-button"
                    onClick={() => {
                      setShowInviteDrawer(false);
                      setIsClosingWaitlist(false);
                    }}
                    aria-label="Close drawer"
                  >
                    <IconDismiss />
                  </button>
                </div>
              </div>

              <div className="invite-drawer-form">
                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">Sender</label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    value="no-reply@hudl.com"
                    readOnly
                  />
                  <p className="invite-drawer-help-text">
                    Include your contact information in the message so recipients know how to reach you.
                  </p>
                </div>

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    To <span className="invite-drawer-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    value={getSelectedAthleteNames()}
                    readOnly
                  />
                </div>

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    Subject <span className="invite-drawer-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    defaultValue="You're off the waitlist!"
                  />
                </div>

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    Message <span className="invite-drawer-label-required">*</span>
                  </label>
                  <div className="invite-drawer-textarea-wrapper">
                    <div className="invite-drawer-toolbar"></div>
                    <textarea
                      className="invite-drawer-textarea"
                      placeholder="Compose your message here..."
                    />
                  </div>
                </div>

                {!isClosingWaitlist && (
                  <div className="invite-drawer-field">
                    <label className="invite-drawer-label">Time limit</label>
                    <select className="invite-drawer-select">
                      <option>No limit</option>
                      <option>1 day</option>
                      <option>3 days</option>
                      <option>7 days</option>
                      <option>14 days</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="invite-drawer-footer">
              <UniformButton
                buttonStyle="standard"
                buttonType="primary"
                size="medium"
                onClick={() => {
                  if (isClosingWaitlist) {
                    setWaitlistOpen(false);
                    setShowInviteDrawer(false);
                    setIsClosingWaitlist(false);
                    setToastMessage('Waitlists closed');
                  } else {
                    // Capture count before clearing
                    const count = selectedRows.size;
                    // Add selected athletes to invited set
                    const newInvited = new Set(invitedAthletes);
                    selectedRows.forEach(index => newInvited.add(index));
                    setInvitedAthletes(newInvited);
                    // Close drawer and clear selection
                    setShowInviteDrawer(false);
                    setSelectedRows(new Set());
                    // Show toast
                    setToastMessage(count === 1 ? 'Invite sent' : `${count} invites sent`);
                  }
                }}
              >
                {isClosingWaitlist ? 'Close Waitlists' : (selectedRows.size === 1 ? 'Send Invite' : 'Send Invites')}
              </UniformButton>
            </div>
          </div>
        </>
      )}

      {/* Athlete Details Drawer */}

      {/* Invite Drawer */}
      {showInviteDrawer && (
        <>
          <div
            className="invite-drawer-overlay"
            onClick={() => {
              setShowInviteDrawer(false);
              setIsClosingWaitlist(false);
            }}
          />
          <div className="invite-drawer">
            <style>
              {`
                .invite-drawer-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 9998;
                  animation: fadeIn 0.2s ease;
                }

                .invite-drawer {
                  position: fixed;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 600px;
                  max-width: 90vw;
                  background-color: var(--u-color-background-container, #fefefe);
                  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
                  z-index: 9999;
                  display: flex;
                  flex-direction: column;
                  animation: slideInRight 0.3s ease;
                  overflow: hidden;
                }

                @keyframes slideInRight {
                  from {
                    transform: translateX(100%);
                  }
                  to {
                    transform: translateX(0);
                  }
                }

                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }

                .invite-drawer-content {
                  flex: 1;
                  overflow-y: auto;
                  padding: var(--u-space-one-and-half, 24px);
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one-and-half, 24px);
                }

                .invite-drawer-header {
                  position: sticky;
                  top: 0;
                  background-color: var(--u-color-background-container, #fefefe);
                  z-index: 10;
                  padding-bottom: var(--u-space-one-and-half, 24px);
                  margin-bottom: calc(-1 * var(--u-space-one-and-half, 24px));
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-half, 8px);
                }

                .invite-drawer-header-top {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                }

                .invite-drawer-close-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                  margin-top: -4px;
                  margin-right: -4px;
                }

                .invite-drawer-close-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }

                .invite-drawer-close-button:active {
                  background-color: var(--u-color-line-subtle, #c4c6c8);
                }

                .invite-drawer-footer {
                  position: sticky;
                  bottom: 0;
                  background-color: var(--u-color-background-container, #fefefe);
                  border-top: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  padding: var(--u-space-one, 16px) var(--u-space-one-and-half, 24px);
                  z-index: 10;
                  display: flex;
                  justify-content: flex-end;
                  gap: var(--u-space-one, 16px);
                }

                .invite-drawer-title {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.2;
                  color: var(--u-color-base-foreground-contrast, #071c31);
                  margin: 0;
                }

                .invite-drawer-description {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-small, 14px);
                  line-height: 1.4;
                  color: var(--u-color-base-foreground, #36485c);
                  margin: 0;
                  margin-top: var(--u-space-half, 8px);
                }

                .invite-drawer-form {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-three-quarter, 12px);
                }

                .invite-drawer-field {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-quarter, 4px);
                }

                .invite-drawer-label {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1;
                  color: var(--u-color-base-foreground, #36485c);
                  display: flex;
                  gap: var(--u-space-eighth, 2px);
                  align-items: center;
                }

                .invite-drawer-label-required {
                  color: var(--u-color-alert-foreground, #bb1700);
                }

                .invite-drawer-input {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  padding: 0 var(--u-space-one, 16px);
                  min-height: 40px;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  opacity: 1;
                }

                .invite-drawer-input:focus {
                  outline: none;
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                  opacity: 1;
                }

                .invite-drawer-input[readonly] {
                  background-color: var(--u-color-background-callout, #f8f8f9);
                  opacity: 0.8;
                }

                .invite-drawer-help-text {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-micro, 12px);
                  line-height: 1.4;
                  color: var(--u-color-content-subtle, #506277);
                  margin: 0;
                }

                .invite-drawer-textarea-container {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-one-and-half, 24px);
                }

                .invite-drawer-textarea-wrapper {
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  display: flex;
                  flex-direction: column;
                  height: 350px;
                }

                .invite-drawer-toolbar {
                  display: flex;
                  gap: var(--u-space-small, 4px);
                  align-items: center;
                  padding: var(--u-space-quarter, 4px) var(--u-space-one, 16px);
                  border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
                }

                .invite-drawer-textarea {
                  flex: 1;
                  padding: var(--u-space-one, 16px);
                  font-family: 'Helvetica', sans-serif;
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.5;
                  color: #13293f;
                  border: none;
                  outline: none;
                  resize: none;
                  overflow-y: auto;
                }

                .invite-drawer-placeholder {
                  color: var(--u-color-emphasis-background-contrast-hover, #085bb4);
                }

                .invite-drawer-select {
                  background-color: var(--u-color-background-container, #fefefe);
                  border: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  border-radius: var(--u-border-radius-small, 2px);
                  padding: 0 var(--u-space-one, 16px);
                  min-height: 40px;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-medium, 500);
                  font-size: var(--u-font-size-default, 16px);
                  line-height: 1.15;
                  color: var(--u-color-base-foreground, #36485c);
                  opacity: 1;
                  cursor: pointer;
                }

                .invite-drawer-select:focus {
                  outline: none;
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                  opacity: 1;
                }

                .invite-drawer-select:hover {
                  border-color: var(--u-color-emphasis-background-contrast, #0273e3);
                }
              `}
            </style>
            <div className="invite-drawer-content">
              <div className="invite-drawer-header">
                <div className="invite-drawer-header-top">
                  <div style={{ flex: 1 }}>
                    <h2 className="invite-drawer-title">
                      {isClosingWaitlist ? 'Close Waitlists' : 'Compose Your Message'}
                    </h2>
                    <p className="invite-drawer-description">
                      {isClosingWaitlist 
                        ? 'You are about to close this program\'s waitlists. Athletes will no longer be able to sign up for this program.'
                        : 'Selected athletes will receive an email invitation that they are off the waitlist.'}
                    </p>
                  </div>
                  <button
                    className="invite-drawer-close-button"
                    onClick={() => {
                      setShowInviteDrawer(false);
                      setIsClosingWaitlist(false);
                    }}
                    aria-label="Close drawer"
                  >
                    <IconDismiss />
                  </button>
                </div>
              </div>

              <div className="invite-drawer-form">
                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">Sender</label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    value="no-reply@hudl.com"
                    readOnly
                  />
                  <p className="invite-drawer-help-text">
                    Include your contact information in the message so recipients know how to reach you.
                  </p>
                </div>

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    To <span className="invite-drawer-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    value={getSelectedAthleteNames()}
                    readOnly
                  />
                </div>

                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    Subject <span className="invite-drawer-label-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="invite-drawer-input"
                    defaultValue="You are now off the waitlist"
                  />
                </div>
              </div>

              <div className="invite-drawer-textarea-container">
                <div className="invite-drawer-field">
                  <label className="invite-drawer-label">
                    Message <span className="invite-drawer-label-required">*</span>
                  </label>
                  <div className="invite-drawer-textarea-wrapper">
                    <div className="invite-drawer-toolbar">
                      <UniformButton buttonStyle="minimal" buttonType="primary" size="medium">
                        B
                      </UniformButton>
                      <div style={{ display: 'flex', gap: 'var(--u-space-tiny, 4px)' }}>
                        <UniformButton buttonStyle="minimal" buttonType="primary" size="medium">
                          L
                        </UniformButton>
                        <UniformButton buttonStyle="minimal" buttonType="primary" size="medium">
                          C
                        </UniformButton>
                        <UniformButton buttonStyle="minimal" buttonType="primary" size="medium">
                          R
                        </UniformButton>
                      </div>
                      <UniformButton buttonStyle="minimal" buttonType="primary" size="medium">
                        •
                      </UniformButton>
                      <UniformButton buttonStyle="minimal" buttonType="primary" size="medium">
                        🔗
                      </UniformButton>
                    </div>
                    <textarea
                      className="invite-drawer-textarea"
                      defaultValue={`Congratulations! We are thrilled to invite {{firstName}} to claim a roster spot with {{teamName}} for the upcoming season. Following her strong performance at tryouts, our coaching staff is confident that she brings the skills, attitude, and potential that will make her a great addition to {{teamName}}.

This invitation secures her opportunity to join the roster, pending your acceptance and completion of registration. At {{teamName}}, we are dedicated to helping athletes grow both on and off the field—developing technical skill, game knowledge, and resilience, while fostering teamwork and lasting friendships.

We believe {{firstName}} will thrive in this environment and contribute to a competitive, fun, and rewarding year ahead. To finalize her place, please review the details included with this invitation and complete the registration by the stated deadline.

We look forward to supporting Jennifer's journey and are excited to welcome your family into the {{teamName}} community!`}
                    />
                  </div>
                </div>

                {!isClosingWaitlist && (
                  <div className="invite-drawer-field">
                    <label className="invite-drawer-label">Time limit</label>
                    <select className="invite-drawer-select">
                      <option value="">Select time limit</option>
                      <option value="24">24 hours</option>
                      <option value="48">48 hours</option>
                      <option value="72">72 hours</option>
                      <option value="168">7 days</option>
                      <option value="336">14 days</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="invite-drawer-footer">
              <UniformButton
                buttonStyle="standard"
                buttonType="primary"
                size="medium"
                onClick={() => {
                  if (isClosingWaitlist) {
                    // Close waitlist
                    setWaitlistOpen(false);
                    setShowInviteDrawer(false);
                    setIsClosingWaitlist(false);
                    setToastMessage('Waitlists closed');
                  } else {
                    // Capture count before clearing
                    const count = selectedRows.size;
                    
                    // Mark selected athletes as invited
                    const newInvited = new Set(invitedAthletes);
                    selectedRows.forEach(index => {
                      newInvited.add(index);
                    });
                    setInvitedAthletes(newInvited);
                    
                    // Close drawer and clear selections
                    setShowInviteDrawer(false);
                    setSelectedRows(new Set());
                    
                    // Show toast
                    setToastMessage(`${count} ${count === 1 ? 'invite' : 'invites'} sent`);
                  }
                }}
              >
                {isClosingWaitlist ? 'Close Waitlists' : (selectedRows.size === 1 ? 'Send Invite' : 'Send Invites')}
              </UniformButton>
            </div>
          </div>
        </>
      )}

      {/* Athlete Details Drawer */}
      {showAthleteDrawer && selectedAthlete && (
        <>
          <div
            className="athlete-drawer-overlay"
            onClick={() => setShowAthleteDrawer(false)}
          />
          <div className="athlete-drawer">
            <style>
              {`
                .athlete-drawer-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-color: rgba(0, 0, 0, 0.5);
                  z-index: 9998;
                  animation: fadeIn 0.2s ease;
                }

                .athlete-drawer {
                  position: fixed;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 100%;
                  max-width: 360px;
                  min-width: 288px;
                  background-color: var(--u-color-background-container, #fefefe);
                  box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.1), 0px 0px 64px 0px rgba(0, 0, 0, 0.1);
                  z-index: 9999;
                  display: flex;
                  flex-direction: column;
                  animation: slideInRight 0.3s ease;
                  overflow: hidden;
                }

                .athlete-drawer-header {
                  background-color: var(--u-color-background-container, #fefefe);
                  border-bottom: 1px solid var(--u-color-line-subtle, #c4c6c8);
                  padding: var(--u-space-one, 16px);
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: var(--u-space-three-quarter, 12px);
                  position: sticky;
                  top: 0;
                  z-index: 2;
                  width: 100%;
                }

                .athlete-drawer-header-left {
                  display: flex;
                  align-items: center;
                  gap: var(--u-space-quarter, 4px);
                  flex: 1;
                  min-width: 0;
                }

                .athlete-drawer-avatar {
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background-color: var(--u-color-base-background-contrast, #607081);
                  color: var(--u-color-emphasis-foreground-reversed, #fefefe);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-small, 14px);
                  flex-shrink: 0;
                }

                .athlete-drawer-name {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.2;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  flex: 1;
                  min-width: 0;
                }

                .athlete-drawer-close-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                }

                .athlete-drawer-close-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }

                .athlete-drawer-content {
                  flex: 1;
                  overflow-y: auto;
                  padding: 0;
                  background-color: var(--u-color-background-container, #fefefe);
                }

                .athlete-drawer-section {
                  background-color: transparent;
                  border-radius: 0;
                  padding: var(--u-space-one-and-half, 24px) var(--u-space-one, 16px);
                  margin: 0;
                }

                .athlete-drawer-section-title {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-default, 16px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.2;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                  margin: 0 0 var(--u-space-half, 8px) 0;
                }

                .athlete-drawer-field-group {
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-three-quarter, 12px);
                }

                .athlete-drawer-field-row {
                  display: flex;
                  gap: 12px;
                }

                .athlete-drawer-field {
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  gap: var(--u-space-eighth, 2px);
                }

                .athlete-drawer-field-label {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-bold, 700);
                  font-size: var(--u-font-size-small, 14px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.4;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                }

                .athlete-drawer-field-value {
                  font-family: var(--u-font-body);
                  font-weight: var(--u-font-weight-default, 400);
                  font-size: var(--u-font-size-default, 16px);
                  color: var(--u-color-base-foreground, #36485c);
                  line-height: 1.4;
                  letter-spacing: var(--u-letter-spacing-default, 0px);
                }

                .athlete-drawer-field-value-with-action {
                  display: flex;
                  align-items: center;
                  gap: var(--u-space-quarter, 4px);
                }

                .athlete-drawer-divider {
                  height: 0;
                  position: relative;
                  margin: var(--u-space-half, 8px) 0;
                }

                .athlete-drawer-divider::before {
                  content: '';
                  position: absolute;
                  top: -0.5px;
                  left: 0;
                  right: 0;
                  height: 1px;
                  background-color: var(--u-color-line-subtle, #c4c6c8);
                }

                .athlete-drawer-copy-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 24px;
                  height: 24px;
                  background: transparent;
                  border: none;
                  cursor: pointer;
                  color: var(--u-color-base-foreground, #36485c);
                  border-radius: var(--u-border-radius-small, 2px);
                  transition: background-color 0.2s ease;
                  flex-shrink: 0;
                }

                .athlete-drawer-copy-button:hover {
                  background-color: var(--u-color-background-subtle, #f5f6f7);
                }
              `}
            </style>
            <div className="athlete-drawer-header">
              <div className="athlete-drawer-header-left">
                <div className="athlete-drawer-avatar">
                  {selectedAthlete.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="athlete-drawer-name">{selectedAthlete.name}</div>
              </div>
              <button
                className="athlete-drawer-close-button"
                onClick={() => setShowAthleteDrawer(false)}
                aria-label="Close drawer"
              >
                <IconDismiss />
              </button>
            </div>
            <div className="athlete-drawer-content">
              <div className="athlete-drawer-section">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-one-and-half, 24px)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                    <h3 className="athlete-drawer-section-title">Personal Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                      <div className="athlete-drawer-field-row">
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Gender</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.gender}</div>
                        </div>
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Date of Birth</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.dob}</div>
                        </div>
                      </div>
                      <div className="athlete-drawer-field-row">
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Grade</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.grade}</div>
                        </div>
                        <div className="athlete-drawer-field">
                          <div className="athlete-drawer-field-label">Graduation Year</div>
                          <div className="athlete-drawer-field-value">{selectedAthlete.graduationYear}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="athlete-drawer-divider"></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                    <h3 className="athlete-drawer-section-title">Family Members</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                      <div className="athlete-drawer-field">
                        <div className="athlete-drawer-field-label">Name</div>
                        <div className="athlete-drawer-field-value">{selectedAthlete.familyName}</div>
                      </div>
                      <div className="athlete-drawer-field">
                        <div className="athlete-drawer-field-label">Email</div>
                        <div className="athlete-drawer-field-value-with-action">
                          <span>{selectedAthlete.familyEmail}</span>
                          <button
                            className="athlete-drawer-copy-button"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedAthlete.familyEmail);
                              setToastMessage('Email copied to clipboard');
                            }}
                            aria-label="Copy email"
                          >
                            <IconCopy />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="athlete-drawer-divider"></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                    <h3 className="athlete-drawer-section-title">Registration History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--u-space-three-quarter, 12px)' }}>
                      {selectedAthlete.registrationHistory && selectedAthlete.registrationHistory.map((registration, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 'var(--u-space-three-quarter, 12px)',
                          marginBottom: index < selectedAthlete.registrationHistory.length - 1 ? 'var(--u-space-half, 8px)' : '0'
                        }}>
                          <div className="athlete-drawer-field-row">
                            <div className="athlete-drawer-field">
                              <div className="athlete-drawer-field-label">Program</div>
                              <div className="athlete-drawer-field-value">{registration.program}</div>
                            </div>
                            <div className="athlete-drawer-field">
                              <div className="athlete-drawer-field-label">Season</div>
                              <div className="athlete-drawer-field-value">{registration.season}</div>
                            </div>
                          </div>
                          <div className="athlete-drawer-field">
                            <div className="athlete-drawer-field-label">Status</div>
                            <div className="athlete-drawer-field-value">
                              <span className="waitlist-status-pill">
                                {registration.status === 'Waitlist' ? 'Waitlist' : registration.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MockDashboard;
