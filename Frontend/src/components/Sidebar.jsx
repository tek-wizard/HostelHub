import React from 'react';

const Sidebar = ({ 
  selectedFloor, 
  onFloorSelect, 
  totalFloors,
  getFloorSummary,
  isOpen,
  onClose,
  isMobile
}) => {
  const floors = Array.from({length: totalFloors}, (_, i) => i + 1);

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
          <span className="stat waiting">{floorSummary.waiting} pickup</span>
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
      {isMobile && (
        <div className="sidebar-mobile">
          <div className="sidebar-mobile-header" onClick={() => onClose()}>
            <h3>Floor {selectedFloor}</h3>
            <svg 
              className={`mobile-dropdown-icon ${isOpen ? 'expanded' : ''}`}
              width="20" 
              height="20" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className={`sidebar-mobile-content ${isOpen ? '' : 'collapsed'}`}>
            <nav className="floor-nav-mobile">
              {floors.map(floor => {
                const floorSummary = getFloorSummary(floor);
                return (
                  <FloorItem
                    key={floor}
                    floor={floor}
                    isActive={selectedFloor === floor}
                    onSelect={onFloorSelect}
                    floorSummary={floorSummary}
                  />
                );
              })}
            </nav>
          </div>
        </div>
      )}

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
                onSelect={onFloorSelect}
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