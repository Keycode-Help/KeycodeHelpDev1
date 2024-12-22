import React from 'react';
import { Link } from 'react-router-dom';

export default function RegionBanner({ 
    message = "Currently available in US & Canada only",
    linkText = "View Requirements",
    linkPath = "/requirements",
    className = ""
}) {
    return (
        <div className={`bg-slate/80 text-white text-sm py-2 ${className}`}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <p className="flex items-center gap-2">
                    <span className="text-success">●</span>
                    {message}
                    <Link 
                        to={linkPath} 
                        className="text-primary hover:text-success underline ml-2"
                    >
                        {linkText}
                    </Link>
                </p>
            </div>
        </div>
    );
}