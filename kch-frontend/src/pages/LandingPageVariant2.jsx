import React from 'react';
import '../styles/LandingPage.css';

export default function LandingPageVariant2() {
    return (
        <div className="bg-black text-white">
            {/* Hero Section */}
            <section className="px-6 py-12 bg-gray-900 text-white text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                    Unlock Key Codes Your Way
                </h1>
                <p className="text-lg md:text-xl mt-4">
                    Pay as You Go or Save Big with a Membership.
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                    <button className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">
                        Get a Key Code Now (Guest Access)
                    </button>
                    <button className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700">
                        Become a Member & Save
                    </button>
                </div>
            </section>

            {/* Add additional sections here */}
        </div>
    );
}
