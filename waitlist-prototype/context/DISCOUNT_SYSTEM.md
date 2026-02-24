# Discount System Overview

This document provides a comprehensive overview of how the discount/promo code system works in the checkout application.

## Overview

The discount system supports both **fixed-amount** and **percentage-based** discounts that are applied using a "waterfall" method across payment installments. Discounts can only be applied one at a time, and once applied, they persist until explicitly removed by the user.

## Promo Code Structure

Promo codes are defined in `src/utils/promoCodeValidation.js` in the `PROMO_CODES` object. Each code has the following structure:

```javascript
{
  'CODE_NAME': {
    discount: <number>,        // Percentage as decimal (0.10 = 10%) OR fixed amount (200 = $200)
    type: 'percentage' | 'fixed',
    name: 'Display Name'
  }
}
```

### Current Promo Codes

- **STAFF20**: 20% percentage discount
- **EARLY10**: 10% percentage discount  
- **FIXED200**: $200 fixed discount
- **FIXED300**: $300 fixed discount

## Discount Calculation

### Total Discount Calculation

The total discount amount is calculated based on the discount type:

- **Percentage**: `totalDiscount = registrationTotal * discount`
  - Example: $2,000 × 0.10 = $200 discount
  
- **Fixed**: `totalDiscount = discount`
  - Example: $200 fixed discount

### Waterfall Application Method

Discounts are applied sequentially to payments in order until the discount is exhausted:

1. **Deposit** (if applicable) - discount applied first
2. **Payment 1** - discount applied next
3. **Payment 2** - discount applied if any remains
4. **Payment 3** - discount applied if any remains
5. And so on...

**Important**: Payment dates remain unchanged. If a payment is reduced to $0, the next payment receives the remaining discount.

## Payment Methods

The system supports three payment methods (determined by URL query param `?method=`):

### 1. Full Payment (`method=full-payment`)
- **Structure**: Single payment of $2,000
- **Due Today**: Full amount (or discounted amount if discount applied)
- **Discount Application**: Applied directly to the single payment

### 2. Deposit + Installments (`method=deposit-installments`)
- **Structure**: 
  - Deposit: $200 (due today)
  - Payment 2: $600 (due April 10, 2024)
  - Payment 3: $600 (due May 10, 2024)
  - Payment 4: $600 (due June 10, 2024)
- **Due Today**: Deposit amount (or discounted deposit if discount applied)
- **Discount Application**: Waterfall through deposit → payment 2 → payment 3 → payment 4

### 3. Installments Only (`method=installments`)
- **Structure**:
  - Payment 1: $500 (due April 10, 2024)
  - Payment 2: $500 (due May 10, 2024)
  - Payment 3: $500 (due June 10, 2024)
  - Payment 4: $500 (due July 10, 2024)
- **Due Today**: $0 (nothing due today, even with discounts)
- **Discount Application**: Waterfall through payment 1 → payment 2 → payment 3 → payment 4

## Discount Application Examples

### Example 1: Fixed $200 on Deposit + Installments
- **Registration**: $2,000
- **Discount**: $200 fixed
- **Result**:
  - Deposit: $200 → $0 (discount fully applied)
  - Payment 2: $600 (unchanged)
  - Payment 3: $600 (unchanged)
  - Payment 4: $600 (unchanged)
- **Total**: $1,800
- **Due Today**: $0

### Example 2: Fixed $300 on Deposit + Installments
- **Registration**: $2,000
- **Discount**: $300 fixed
- **Result**:
  - Deposit: $200 → $0 (discount partially applied, $100 remaining)
  - Payment 2: $600 → $500 (remaining $100 discount applied)
  - Payment 3: $600 (unchanged)
  - Payment 4: $600 (unchanged)
- **Total**: $1,700
- **Due Today**: $0

### Example 3: Percentage 10% on Deposit + Installments
- **Registration**: $2,000
- **Discount**: 10% = $200
- **Result**: Same as Example 1 (deposit reduced to $0, installments unchanged)
- **Total**: $1,800
- **Due Today**: $0

### Example 4: Percentage 20% on Installments Only
- **Registration**: $2,000
- **Discount**: 20% = $400
- **Result**:
  - Payment 1: $500 → $100 ($400 discount applied)
  - Payment 2: $500 (unchanged)
  - Payment 3: $500 (unchanged)
  - Payment 4: $500 (unchanged)
- **Total**: $1,600
- **Due Today**: $0 (nothing due today for installments-only)

## User Flow

1. **User enters promo code** in the Promotions section
2. **Code is validated** (simulated 1-second API delay)
3. **If valid**:
   - Discount is applied using waterfall method
   - Success state shown in button
   - Discount appears in Payment Summary
   - Input is cleared
4. **If invalid**:
   - Error message displayed
   - No discount applied
5. **Removing discount**:
   - User clicks "×" button next to discount in Payment Summary
   - Discount is removed, all amounts revert to original

## State Management

### Component Hierarchy

```
CheckoutPage (manages discount state)
├── RegistrationSummary (displays payment option, can open schedule modal)
├── Promotions (handles code input and validation)
├── PaymentSummary (displays discount and calculates totals)
└── PaymentInformation (form validation)
```

### Discount State Flow

1. **Promotions component**:
   - User enters code → `handleInputChange` → calls `onPromoCodeChange`
   - User clicks Apply → `handleApply` → validates code → calls `onDiscountApplied` with discount info

2. **CheckoutPage**:
   - Receives discount via `handleDiscountApplied`
   - Stores in `discount` state
   - Passes to `PaymentSummary` and `RegistrationSummary`

3. **PaymentSummary**:
   - Receives `discount` prop
   - Calls `calculateWaterfallDiscount` to get discounted amounts
   - Displays discount line item and updated totals

## Key Functions

### `validatePromoCode(code)`
- **Location**: `src/utils/promoCodeValidation.js`
- **Purpose**: Validates a promo code and returns discount information
- **Returns**: 
  ```javascript
  {
    valid: boolean,
    discount: number,      // Percentage (0-1) or fixed amount
    type: 'percentage' | 'fixed',
    name: string,
    code: string
  }
  ```

### `calculateWaterfallDiscount(registrationTotal, discount, discountType, paymentMethod)`
- **Location**: `src/utils/promoCodeValidation.js`
- **Purpose**: Calculates how discount flows through payments
- **Returns**:
  ```javascript
  {
    totalDiscount: number,
    discountedPayments: Array<{
      amount: number,           // Discounted amount
      originalAmount?: number,   // Original amount (if discounted)
      discountApplied?: number,  // Amount of discount applied
      date: Date,
      type?: 'deposit' | 'installment'
    }>,
    discountedTotalDueToday: number,
    discountedRegistrationTotal: number
  }
  ```

### `getPaymentSchedule(registrationTotal, discount, discountType, paymentMethod)`
- **Location**: `src/utils/promoCodeValidation.js`
- **Purpose**: Formats payment schedule data for modal display
- **Returns**: Payment schedule with formatted dates and descriptions

## Transaction Fee Calculation

Transaction fees are calculated as **3.9% of the amount due today**:
- If due today is $0, transaction fee is $0
- If due today is $200, transaction fee is $200 × 0.039 = $7.80

## UI Components

### Promotions Component
- Input field (uppercase text, regular case placeholder)
- Apply button (secondary style, shows status: applying/success/failure)
- Status icons (Confirmation.svg for success, Critical.svg for failure)
- Error/success messages

### Payment Summary Component
- Displays registration total
- Shows discount line item (if applied) with remove button
- Shows "Due Today" (discounted amount)
- Shows transaction fee (3.9% of due today)
- Shows total due today

### Payment Schedule Modal
- Displays all payments with dates
- Shows both original and discounted amounts (if discount applied)
- Accessible via "View Schedule" link in Registration Summary

## Important Behaviors

1. **One discount at a time**: System prevents applying a second code if one is already active
2. **Discount persistence**: Once applied, discount remains until user clicks remove button
3. **Input independence**: User can type new codes in input field without affecting applied discount
4. **State reset**: Focusing input field resets UI states (success/error) but keeps discount applied
5. **Due today calculation**: For installments-only, due today is always $0, even with discounts

## Files

- `src/utils/promoCodeValidation.js` - Core discount logic and validation
- `src/components/checkout/Promotions.jsx` - Promo code input and validation UI
- `src/components/checkout/PaymentSummary.jsx` - Discount display and total calculations
- `src/components/checkout/PaymentScheduleModal.jsx` - Payment schedule modal
- `src/pages/CheckoutPage.jsx` - State management and component orchestration




