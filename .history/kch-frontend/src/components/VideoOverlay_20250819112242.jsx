import React from 'react';
import { Icon } from './IconProvider';

export default function VideoOverlay({ onClose }) {
    return (
        <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="relative max-w-4xl text-center p-8">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute -top-4 -right-4 p-2 hover:text-success transition-colors
                             bg-dark/50 rounded-full hover:bg-dark/80"
                    aria-label="Close overlay"
                >
                    <Icon name="x" size={24} />
                </button>

                {/* Content */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 
                             bg-gradient-to-r from-primary via-success to-cta 
                             bg-clip-text text-transparent">
                    Unlock Key Codes Your Way
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-12">
                    Pay as You Go or Save Big with a Membership
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button className="btn btn-lg btn-primary">
                        <Icon name="key" size={24} />
                        Get Key Code Now
                        <span className="block text-sm opacity-75">Guest Access</span>
                    </button>
                    <button className="btn btn-lg btn-outline">
                        <Icon name="userCheck" size={24} />
                        Become a Member
                        <span className="block text-sm opacity-75">Save up to 20%</span>
                    </button>
                </div>

                <p className="mt-8 text-white/60">
                    Click the X to watch our introduction video
                </p>
            </div>
        </div>
    );
} 