import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegionBanner from '../components/RegionBanner';
import SignUpSteps from '../components/SignUpSteps';
import VideoOverlay from '../components/VideoOverlay';
import TrialBanner from '../components/TrialBanner';
import { Icon } from '../components/IconProvider';

export default function LandingPageVariant2() {
    const [showOverlay, setShowOverlay] = useState(true);
    const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            if (hasWatchedVideo && window.scrollY > 100) {
                setShowOverlay(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasWatchedVideo]);

    return (
        <div className="bg-dark text-white min-h-screen">
            <RegionBanner />
            
            {/* Hero Section */}
            <section className="relative w-full min-h-[300px] xs:min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px]">
                {/* Background Video Container */}
                <div className="absolute inset-0 bg-dark">
                    <div className="relative w-full h-full">
                        {/* Video Wrapper for Aspect Ratio */}
                        <div className="relative w-full h-full">
                            <video 
                                className="absolute inset-0 w-full h-full
                                         object-cover
                                         sm:object-contain md:object-cover
                                         opacity-100
                                         transition-all duration-300"
                                autoPlay={true}
                                muted={true}
                                playsInline={true}
                                preload="auto"
                                controls={!showOverlay}
                                poster="/assets/images/hero/Hero.jpg"
                            >
                                <source 
                                    src="/assets/Videos/Unlock_Efficiency__Keycode_Help_for_Locksmiths-VEED.mp4" 
                                    type="video/mp4" 
                                />
                            </video>

                            {/* Video Gradient Overlay */}
                            <div className="absolute inset-0 
                                          bg-gradient-to-b from-dark/40 via-transparent to-dark/40
                                          pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Video Controls Overlay */}
                {!showOverlay && (
                    <div className="absolute bottom-0 left-0 right-0 
                                  p-4 md:p-6
                                  bg-gradient-to-t from-dark/60 to-transparent">
                        <div className="max-w-7xl mx-auto">
                            <p className="text-sm md:text-base text-white/80 text-center">
                                Scroll down to continue
                            </p>
                        </div>
                    </div>
                )}

                {/* Video Overlay */}
                {showOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <VideoOverlay 
                            onClose={() => {
                                setShowOverlay(false);
                                setHasWatchedVideo(true);
                            }}
                        />
                    </div>
                )}
            </section>

            {/* Main Content Container */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Trial Banner */}
                <div className="my-8 md:my-12">
                    <TrialBanner />
                </div>

                {/* Features Grid */}
                <section className="py-16 md:py-24">
                    <h2 className="text-4xl font-bold text-center mb-16">Why Choose KeyCode Help?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Fast Delivery */}
                        <div className="bento-item text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
                                <Icon name="zap" size={32} className="text-success" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
                            <p className="text-white/70">
                                Get your key codes within 5-30 minutes
                            </p>
                        </div>

                        {/* 24/7 Support */}
                        <div className="bento-item text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
                                <Icon name="headphones" size={32} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
                            <p className="text-white/70">
                                Technical assistance whenever you need it
                            </p>
                        </div>

                        {/* Secure Platform */}
                        <div className="bento-item text-center">
                            <div className="w-16 h-16 mx-auto mb-6 bg-cta/20 rounded-full flex items-center justify-center">
                                <Icon name="shield" size={32} className="text-cta" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
                            <p className="text-white/70">
                                Verified professional access only
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 md:py-24">
                    <SignUpSteps />
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-24 bg-primary/10 rounded-2xl">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                        <p className="text-xl text-white/80 mb-8">
                            Choose the option that works best for you
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn-cta flex items-center gap-2">
                                <Icon name="key" size={20} />
                                Order Single Key Code
                            </button>
                            <button className="btn-primary flex items-center gap-2">
                                <Icon name="userCheck" size={20} />
                                View Membership Plans
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate py-8 mt-16">
                <div className="max-w-7xl mx-auto px-8 text-center text-white/60">
                    <p className="mb-4 flex items-center justify-center gap-2">
                        <Icon name="badgeCheck" size={16} className="text-success" />
                        Service available to verified automotive professionals in US & Canada
                    </p>
                    <Link 
                        to="/requirements" 
                        className="text-primary hover:text-success underline flex items-center justify-center gap-2"
                    >
                        <Icon name="helpCircle" size={16} />
                        View Requirements
                    </Link>
                    <p className="mt-8">
                        &copy; 2024 KeyCode Help. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
