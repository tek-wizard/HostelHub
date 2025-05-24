import React from 'react';

const Sidebar = ({ 
  selectedFloor, 
  onFloorSelection, 
  getFloorSummary,
  isMobileSidebarOpen,
  onToggleMobileSidebar
}) => {
  const floors = [1, 2, 3, 4, 5];

  const FloorItem = ({ floor, isActive, onSelect, floorSummary }) => (
    <button
      onClick={() => onSelect(floor)}
      className={`floor-item ${isActive ? 'active' : ''}`}
    >
      <div className="floor-info">
        <h4>Floor {floor}</h4>
        <div className="floor-stats">
          <span className="stat available">{floorSummary.available} free</span>
          <span className="stat occupied">{floorSummary.occupied} busy</span>
          <span className="stat waiting">{floorSummary.waitingPickup} pickup</span>
        </div>
      </div>
      <div className="floor-indicator">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );

  return (
    <>
      {/* Mobile Sidebar Dropdown */}
      <div className="sidebar-mobile">
        <div className="sidebar-mobile-header" onClick={onToggleMobileSidebar}>
          <h3>Floor {selectedFloor}</h3>
          <svg 
            className={`mobile-dropdown-icon ${isMobileSidebarOpen ? 'expanded' : ''}`}
            width="20" 
            height="20" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className={`sidebar-mobile-content ${isMobileSidebarOpen ? '' : 'collapsed'}`}>
          <nav className="floor-nav-mobile">
            {floors.map(floor => {
              const floorSummary = getFloorSummary(floor);
              return (
                <FloorItem
                  key={floor}
                  floor={floor}
                  isActive={selectedFloor === floor}
                  onSelect={onFloorSelection}
                  floorSummary={floorSummary}
                />
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Floors</h3>
        </div>
        <nav className="floor-nav">
          {floors.map(floor => {
            const floorSummary = getFloorSummary(floor);
            return (
              <FloorItem
                key={floor}
                floor={floor}
                isActive={selectedFloor === floor}
                onSelect={onFloorSelection}
                floorSummary={floorSummary}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar; 