import React from "react";

// Ultra minimal component - no dependencies, no hooks, no imports
function UltraMinimal() {
  return (
    <div>
      <h1>Ultra Minimal Test</h1>
      <p>Time: {Date.now()}</p>
      <p>If this refreshes, the issue is in browser/environment</p>
    </div>
  );
}

export default UltraMinimal;
