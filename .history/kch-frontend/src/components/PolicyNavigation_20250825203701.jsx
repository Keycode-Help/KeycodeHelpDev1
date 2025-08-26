import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, DollarSign, Clock, AlertTriangle } from "lucide-react";

const PolicyNavigation = () => {
  return (
    <div className="policy-nav">
      <h3>Legal & Policy Pages</h3>
      <div className="policy-nav-links">
        <Link to="/privacy-policy" className="policy-nav-link">
          <Shield className="nav-icon" />
          <span>Privacy Policy</span>
        </Link>
        
        <Link to="/terms-of-service" className="policy-nav-link">
          <FileText className="nav-icon" />
          <span>Terms of Service</span>
        </Link>
        
        <Link to="/tos" className="policy-nav-link">
          <FileText className="nav-icon" />
          <span>TOS (Simplified)</span>
        </Link>
        
        <Link to="/refund-policy" className="policy-nav-link">
          <DollarSign className="nav-icon" />
          <span>Refund Policy</span>
        </Link>
        
        <Link to="/membership-cancellation" className="policy-nav-link">
          <Clock className="nav-icon" />
          <span>Cancellation Policy</span>
        </Link>
      </div>
    </div>
  );
};

export default PolicyNavigation;
