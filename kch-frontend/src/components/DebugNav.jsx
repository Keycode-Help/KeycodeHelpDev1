import React from 'react';

const DebugNav = () => {
  const isMobile = window.innerWidth <= 768;
  
  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      left: '10px',
      background: 'red',
      color: 'white',
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px',
      borderRadius: '5px'
    }}>
      <div>Debug Info:</div>
      <div>Width: {window.innerWidth}px</div>
      <div>Height: {window.innerHeight}px</div>
      <div>Is Mobile: {isMobile ? 'Yes' : 'No'}</div>
      <div>Mobile Nav: {document.querySelector('.mobile-nav') ? 'Found' : 'Not Found'}</div>
      <div>Desktop Nav: {document.querySelector('.navbar') ? 'Found' : 'Not Found'}</div>
    </div>
  );
};

export default DebugNav;
