# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based dashboard application serving dual purposes:
1. **Primary**: A functional mock dashboard for "2024-2025 Club Dues" - a sports registration and payment management system
2. **Secondary**: An experimental platform for integrating with and consuming components from a corporate Storybook design system (Uniform Web Storybook)

The application showcases component reuse patterns and demonstrates how to build complex UIs using a centralized design system library.

## Technology Stack

- **React 18.2.0** - UI library
- **Vite 5.0.0** - Build tool and dev server
- **Storybook 7.6.0** - Component documentation and design system browser
- **CSS Custom Properties** - Design tokens from Uniform Web design system
- **Barlow Font** - Google Fonts for typography

## Common Commands

### Development
- `npm run dev` - Start Vite dev server (runs on port 3002)
- `npm run storybook` - Launch Storybook UI (runs on port 6006)

### Build & Deployment
- `npm run build` - Build application with Vite for production
- `npm run build-storybook` - Build static Storybook for hosting
- `npm run preview` - Preview production build locally

## Architecture Overview

### Component Structure

The application uses a **container-presenter pattern** with all state management centralized in `MockDashboard.jsx`. The component hierarchy:

```
App
  └─ MockDashboard (state container)
      ├─ PageHeader (navigation tabs, breadcrumbs, toggles)
      ├─ DataWidget[] (overview cards)
      ├─ RegistrantsTable / RegistrationsTable (presenters)
      ├─ Drill-down views:
      │   ├─ RegistrationOverview (specific registration details)
      │   └─ RegistrantDetails (individual athlete payment history)
      ├─ Modal System (all extend BaseModal):
      │   ├─ RefundModal
      │   ├─ CancelModal
      │   ├─ CancelPlanModal
      │   ├─ EditPaymentModal
      │   └─ ShareModal
      └─ Toast (notifications)
```

### State Management Pattern

All state lives in `MockDashboard.jsx` with these key hooks:
- **Navigation**: `activeTab`, `selectedRegistration`, `selectedRegistrant`
- **Data**: `registrations`, `registrantsData`, `widgets`
- **Filters**: `filterValue`, `searchQuery`
- **UI**: `showShareModal`, `toastMessage`

Child components receive state and handler callbacks. State updates use immutable patterns (spread operators, `.map()`, `.findIndex()`).

### Data Structure

**Mock data** is defined in `MockDashboard.jsx` with:
- **Registrations**: 10 sports registration options (U8-U18 Girls age groups) with payment plans
- **Registrants**: 28+ athlete records with payment history, status, and calculated fields
- **Widgets**: Dashboard summary cards (registrants count, paid/overdue/refunded totals)

**Key calculations** happen in MockDashboard:
- Registration stats computed from registrant arrays
- Registrant status determined by payment state and dates
- Widget totals aggregated from filtered data
- Currency values parsed/formatted using `.toLocaleString()` and `.replace()`

### Feature Views

1. **Overview Tab**: Dashboard with summary widgets and registrant list
2. **Registrations Tab**: Available registration options with enrollment/capacity info
3. **Waitlist Tab**: Waitlisted registrants with filtering and management
4. **Registration Detail Page**: Drill-down view showing registrants for a specific registration
5. **Registrant Detail Page**: Individual payment history with edit/cancel/refund capabilities

## Design System Integration

- Components use CSS custom properties prefixed with `--u-*` (Uniform design system)
- Loaded from `uniform-design-system.css`
- Supports responsive breakpoints:
  - Mobile: 288px-767px
  - Tablet/Desktop: 768px+
- Components follow compound component patterns for flexibility

## Storybook Configuration

- Stories pattern: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Storybook composition enabled in `.storybook/main.js`
- External reference to Uniform Web Storybook:
  - URL: `https://uniform-web.storybook.hudltools.com`
  - ID: `uniform-web`
- Essential addons enabled (Controls, Actions, Docs, Interactions)

## Key Code Patterns

### Component Updates
All state updates are immutable. Examples:
- **Array mutation**: `registrations.map((reg) => reg.id === id ? {...reg, ...changes} : reg)`
- **Finding & updating**: Use `.findIndex()` then spread with slice
- **Currency parsing**: `parseFloat(value.replace(/[$,]/g, ''))`
- **Formatting**: Use `.toLocaleString('en-US', {style: 'currency', currency: 'USD'})`

### Modal/Dialog Patterns
- All modals inherit from `BaseModal` base component
- Accept props: `isOpen`, `onClose`, `maxWidth`, handlers like `onConfirm`
- Manage internal state for temporary changes (preview before commit)
- Toast notifications provide feedback after actions

### Props Conventions
- Event handlers: `on*` prefix (e.g., `onRefund`, `onCancelPlan`)
- Boolean flags: `show*` prefix (e.g., `showShareModal`)
- Data props: descriptive names (e.g., `registrantsData`, `filterValue`)
- Configuration: component variants via props (e.g., DataWidget `size`)

## File Organization

- `src/components/` - React components (majority of app code)
- `src/utils/` - Utility functions (e.g., `storybookApi.js` for API integration)
- `.storybook/` - Storybook configuration
- `uniform-design-system.css` - Design token definitions

## Important Notes

- **MockDashboard.jsx** is the largest file (71KB) and contains core business logic - modifications here affect the entire app
- **Responsive design** is implemented via CSS media queries, not component libraries
- **Design system compliance** is critical - always use `--u-*` CSS variables for consistency
- **Status calculations** are complex (Paid > Current > Overdue > Cancelled > Refunded priority order) - review MockDashboard logic carefully
- The app is designed to eventually pull live data, but currently uses mock data definitions
- **Waitlist functionality** is a core feature - ensure waitlist tab and toggle are properly integrated




