import React, { useState } from 'react';
import { FileText, CreditCard, Key, Zap, ClipboardList, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SignUpSteps() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            step: "1",
            title: "Enter VIN",
            desc: "Input your vehicle's VIN number",
            icon: ClipboardList,
            details: "Simply enter your 17-digit Vehicle Identification Number. We'll verify and process it instantly.",
            color: "primary"
        },
        {
            step: "2",
            title: "Pay Securely",
            desc: "Simple one-time payment process",
            icon: CreditCard,
            details: "Choose your preferred payment method. All transactions are secure and encrypted.",
            color: "success"
        },
        {
            step: "3",
            title: "Get Code",
            desc: "Receive your key code in 5-30 minutes",
            icon: KeyRound,
            details: "Your key code will be delivered to your account and email. Most codes arrive within 5 minutes.",
            color: "cta"
        }
    ];

    // Helper function to render icon
    const renderIcon = (IconComponent, index) => {
        return (
            <IconComponent 
                size={32} 
                strokeWidth={2}
                className="text-dark"
                aria-hidden="true"
            />
        );
    };

    return (
        <section className="space-y-12">
            <h2 className="text-4xl font-bold text-center">How It Works</h2>
            
            {/* Steps Timeline Container */}
            <div className="relative py-12">
                {/* Progress Bar */}
                <div className="absolute top-[4.5rem] left-0 w-full h-1 bg-slate/30">
                    <div 
                        className="h-full bg-success transition-all duration-500"
                        style={{ width: `${(activeStep + 1) * 33.33}%` }}
                    />
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {steps.map((item, index) => (
                        <div 
                            key={item.step}
                            className="relative"
                            onMouseEnter={() => setActiveStep(index)}
                        >
                            {/* Icon Circle */}
                            <div className={`w-16 h-16 mx-auto mb-8 rounded-full flex items-center justify-center
                                          transition-all duration-300 transform hover:scale-110
                                          ${index <= activeStep ? `bg-${item.color}` : `bg-${item.color}/30`}`}
                            >
                                {renderIcon(item.icon, index)}
                            </div>

                            {/* Content Box */}
                            <div className={`text-center space-y-3 transition-opacity duration-300
                                     ${index === activeStep ? 'opacity-100' : 'opacity-70'}`}>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-white/70">{item.desc}</p>
                                
                                {/* Expanded Details */}
                                <div className={`transition-all duration-300 overflow-hidden
                                              ${index === activeStep ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-sm text-white/60 mt-2">
                                        {item.details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
                <Link to="/vehicle-keycode-request" className="btn-cta flex items-center gap-2 mx-auto">
                    <Zap size={20} />
                    Start Now
                </Link>
            </div>
        </section>
    );
}
