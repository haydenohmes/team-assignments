import React, { useState, useEffect } from 'react';
import UniformButton from './UniformButton';
import { IconDownload } from './UniformIcons';

/**
 * TableToolbar Component - Toolbar with title, filter, search, and actions
 * Uses Uniform Web Storybook design tokens and Barlow font
 */
const TableToolbar = ({
  title = 'Registrants',
  filterValue = 'All',
  searchPlaceholder = 'Search for…',
  onFilterChange = () => {},
  onSearch = () => {},
  onDownload = () => {},
  showFilter = true,
  showSearch = true,
  showDownload = true,
  actionButton = null,
  filterOptions = null
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <style>
        {`
          .table-toolbar {
            display: flex;
            gap: var(--u-space-one-half, 24px);
            align-items: flex-end;
            width: 100%;
          }

          .table-toolbar-left {
            display: flex;
            flex-direction: column;
            gap: var(--u-space-three-quarter, 12px);
            flex: 1;
            min-width: 0;
          }

          .table-toolbar-title {
            font-family: var(--u-font-body);
            font-weight: var(--u-font-weight-bold, 700);
            font-size: var(--u-font-size-default, 16px);
            color: var(--u-color-base-foreground-contrast, #071c31);
            letter-spacing: var(--u-letter-spacing-default, 0px);
            line-height: 1.2;
            margin: 0;
          }

          .table-toolbar-filter {
            width: 197px;
          }

          .table-toolbar-filter-select {
            width: 100%;
            height: 40px;
            padding: 0 var(--u-space-one, 16px);
            background-color: var(--u-color-background-container, #fefefe);
            border: 1px solid var(--u-color-line-subtle, #c4c6c8);
            border-radius: var(--u-border-radius-small, 2px);
            font-family: var(--u-font-body);
            font-weight: var(--u-font-weight-medium, 500);
            font-size: var(--u-font-size-default, 16px);
            color: var(--u-color-base-foreground, #36485c);
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%2336485c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            padding-right: 36px;
          }

          .table-toolbar-right {
            display: flex;
            gap: var(--u-space-half, 8px);
            align-items: center;
          }

          .table-toolbar-search {
            width: 197px;
            position: relative;
          }

          .table-toolbar-search-input {
            width: 100%;
            height: 40px;
            padding: 0 var(--u-space-one, 16px) 0 40px;
            background-color: var(--u-color-background-container, #fefefe);
            border: 1px solid rgba(167, 174, 181, 0.6);
            border-radius: var(--u-border-radius-small, 2px);
            font-family: var(--u-font-body);
            font-size: var(--u-font-size-default, 16px);
            color: var(--u-color-base-foreground-contrast, #071c31);
          }

          .table-toolbar-search-input::placeholder {
            color: rgba(19, 41, 63, 0.4);
          }

          .table-toolbar-search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            color: var(--u-color-base-foreground, #36485c);
            pointer-events: none;
          }

          @media (max-width: 767px) {
            .table-toolbar {
              flex-direction: column;
              gap: var(--u-space-half, 8px);
              align-items: flex-start;
            }

            .table-toolbar-left {
              width: 100%;
            }

            .table-toolbar-filter {
              width: 100%;
            }

            .table-toolbar-search {
              width: 100%;
            }

            .table-toolbar-right {
              width: 100%;
            }
          }
        `}
      </style>
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          {title && <h3 className="table-toolbar-title">{title}</h3>}
          {showFilter && (
            <div className="table-toolbar-filter">
              <select 
                className="table-toolbar-filter-select"
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
              >
                {filterOptions ? (
                  filterOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))
                ) : (
                  <>
                    <option value="All">All</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Current">Current</option>
                    <option value="Completed">Completed</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Canceled">Canceled</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>
        <div className="table-toolbar-right">
          {showSearch && (
            <div className="table-toolbar-search">
              <svg 
                className="table-toolbar-search-icon"
                viewBox="0 0 20 20" 
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l4 4" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                className="table-toolbar-search-input"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          {actionButton ? (
            actionButton
          ) : showDownload ? (
            <UniformButton
              buttonStyle="standard"
              buttonType="subtle"
              size="medium"
              icon={<IconDownload />}
              onClick={onDownload}
            >
              {!isMobile && 'Download'}
            </UniformButton>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TableToolbar;

