import React from 'react';
import '../styles/LandingPage.css';

export default function LandingPage() {
    return (
        <div className="bg-black text-white">
            {/* Header Section */}
            <header className="flex items-center justify-center py-6">
                <img 
                    src="/dev-images/kchDarkThemeLogo.png" 
                    alt="KeyCode Help Logo" 
                    className="h-12 md:h-16 object-contain"
                />
            </header>

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-6 py-12 md:py-24">
                <div className="md:w-1/2 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        Unlock Your Automotive Potential
                    </h1>
                    <p className="text-lg md:text-xl">
                        Access Key Codes and Expert Support Anytime
                    </p>
                    <button className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">
                        Get Started
                    </button>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                    <img 
                        src="/dev-images/Hero.jpg"
                        alt="Automotive Key Illustration"
                        className="max-w-full h-522 object-cover rounded-lg shadow-lg"
                    />
                </div>
            </section>

           {/* Features Section */}
<section className="px-6 py-12 bg-gray-900">
    <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Key Features
        </h2>
        <p className="text-gray-300 text-lg mb-12">
            Everything you need to streamline your locksmithing and programming tasks.
        </p>
    </div>
    <div className="grid gap-12 md:grid-cols-3">
        {/* Feature Card 1 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mx-auto mb-6">
                <img 
                    src="/databaseIcon.png" 
                    alt="Comprehensive Database" 
                    className="object-contain w-full h-full rounded-full"
                />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">
                Comprehensive Database
            </h3>
            <p className="text-gray-400 text-center">
                Search by VIN, model, or make. Find key codes with ease!
            </p>
        </div>

        {/* Feature Card 2 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mx-auto mb-6">
                <img 
                    src="/Last 24 Hours.png" 
                    alt="24/7 Emergency Access" 
                    className="object-contain w-full h-full rounded-full"
                />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">
                24/7 Emergency Access
            </h3>
            <p className="text-gray-400 text-center">
                Access key codes and support anytime, anywhere.
            </p>
        </div>

        {/* Feature Card 3 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 mx-auto mb-6">
                <img 
                    src="/Online Support.png" 
                    alt="Expert Support" 
                    className="object-contain w-full h-full rounded-full"
                />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">
                Expert Support
            </h3>
            <p className="text-gray-400 text-center">
                Get programming assistance and VIN to keycode search support.
            </p>
        </div>
    </div>
</section>

{/* Sign-Up Process and Membership Details */}
<section id="signup-process" className="px-6 py-12 bg-gray-800 text-white">
    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-6">
        How to Get Started
    </h2>
    <div className="grid gap-12 md:grid-cols-2">
        {/* Step-by-Step Sign-Up Process */}
        <div className="space-y-6">
            <h3 className="text-2xl font-bold">Sign-Up Process</h3>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
                <li>
                    <strong>Create an Account:</strong> Sign up with your email, set a secure password, and start your journey.
                </li>
                <li>
                    <strong>Choose Your Plan:</strong> Select a membership plan that suits your needs or start with a free trial.
                </li>
                <li>
                    <strong>Submit Documentation:</strong> Upload required credentials like ID, business license, and other necessary documents.
                </li>
                <li>
                    <strong>Get Approved:</strong> Access your dashboard within 24-72 hours after verification.
                </li>
            </ol>
            <p className="text-sm text-gray-400">
                Note: Missing documentation may delay your approval. Ensure all submissions are clear and valid.
            </p>
            <div className="mt-4">
                <a href="#membership-tiers" className="text-blue-400 underline hover:text-blue-600">
                    View Membership Tiers
                </a>
            </div>
        </div>

        {/* Membership Plan Highlights */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-center">Membership Plans</h3>
            <ul className="space-y-4 text-gray-300 mt-6">
                <li>
                    <strong>Basic Plan ($9.99/month):</strong> 3 key codes/month, access to selected manufacturers, email support during business hours.
                </li>
                <li>
                    <strong>Standard Plan ($29.99/month):</strong> 5 key codes/month, extended manufacturer access, priority email support, advanced programming guides.
                </li>
                <li>
                    <strong>Premium Plan ($50/month):</strong> Unlimited key codes, full manufacturer support, 24/7 live chat, offline access, and premium features.
                </li>
            </ul>
            <div className="mt-6 text-center">
                <a href="#membership-tiers" className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                    Explore Memberships
                </a>
            </div>
        </div>
    </div>
</section>

{/* Free Trial Section */}
<section id="free-trial" className="px-6 py-12 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
    <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Try KeyCode Help for Free!
        </h2>
        <p className="text-lg md:text-xl mb-8">
            Unlock access to essential features with our 5-day free trial. No commitment, no risk—just pure value to get you started.
        </p>
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg inline-block">
            <h3 className="text-2xl font-bold mb-4">Free Trial Benefits</h3>
            <ul className="space-y-3 text-left">
                <li className="flex items-center">
                    <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
                    Access to 2 key codes from select manufacturers
                </li>
                <li className="flex items-center">
                    <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
                    Explore our intuitive VIN-to-Keycode tools
                </li>
                <li className="flex items-center">
                    <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
                    Basic support to get you started
                </li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
                Upgrade anytime to unlock more features, manufacturers, and expert support.
            </p>
        </div>
        <div className="mt-8">
            <button className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-600">
                Start Free Trial
            </button>
        </div>
        <p className="mt-4 text-sm text-gray-200">
            Already impressed? <a href="#membership-tiers" className="text-yellow-300 underline hover:text-yellow-400">See Membership Plans</a>
        </p>
    </div>
</section>


            {/* Membership Tiers */}
<section id="membership-tiers" className="px-6 py-12 bg-black">
    <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-6">
        Membership Tiers
    </h2>
    <div className="grid gap-8 md:grid-cols-3">
        {/* Starter */}
        <div className="p-8 bg-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold">Starter</h3>
            <p className="mt-4">
                3 key codes/month, access to selected manufacturers, customer support (business hours), referral program.
            </p>
            <p className="mt-6 text-4xl font-bold">$29</p>
            <p className="text-sm">/month</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                Get Started
            </button>
        </div>
        {/* Expert */}
        <div className="p-8 bg-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold">Expert</h3>
            <p className="mt-4">
                5 key codes/month, additional manufacturers, tech database access, extended customer support hours.
            </p>
            <p className="mt-6 text-4xl font-bold">$59</p>
            <p className="text-sm">/3 months</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                Get Started
            </button>
        </div>
        {/* Elite */}
        <div className="p-8 bg-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold">Elite</h3>
            <p className="mt-4">
                10 key codes/month, after-hours support, live webinars, premium features.
            </p>
            <p className="mt-6 text-4xl font-bold">$99</p>
            <p className="text-sm">/3 months</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
                Get Started
            </button>
        </div>
    </div>
</section>


            {/* Footer */}
            <footer className="bg-black text-center py-6">
                <p>&copy; 2024 KeyCode Help. All rights reserved.</p>
            </footer>
        </div>
    );
}
