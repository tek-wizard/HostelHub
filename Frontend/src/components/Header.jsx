import React from 'react';

const Header = ({ overallSummary, onRefresh, refreshing }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* Left - Logo */}
        <div className="header-left">
          <div className="header-logo">
            <span className="logo-text">
              <span className="logo-h">H</span>ostel<span className="logo-h">H</span>ub
            </span>
          </div>
        </div>

        {/* Center - Status Pills */}
        <div className="header-center">
          <div className="status-pills">
            <div className="status-pill available">
              <div className="status-dot"></div>
              Available: {overallSummary.available}
            </div>
            <div className="status-pill occupied">
              <div className="status-dot"></div>
              In Use: {overallSummary.occupied}
            </div>
            <div className="status-pill waiting">
              <div className="status-dot"></div>
              Pickup: {overallSummary.waitingPickup}
            </div>
            <div className="status-pill total">
              <div className="status-dot total-dot"></div>
              Total: {overallSummary.total}
            </div>
          </div>
        </div>

        {/* Right - Refresh Button */}
        <div className="header-right">
          <button 
            onClick={onRefresh}
            disabled={refreshing}
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          >
            <svg 
              className={`refresh-icon ${refreshing ? 'spinning' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 