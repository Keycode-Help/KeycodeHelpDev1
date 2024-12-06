import React from "react";

const Features = () => {
    
    const features = [
        { id: 1, title: "Fast Vin Decoding", description: "Quickly decode vehicle information with ease." },
        { id: 2, title: "Reliable Key Code Access", description: "Securely retrieve key codes for vehicles." },
        { id: 3, title: "24/7 Support", description: "We’re here to help, any time of the day." },
    ];

    return (
        <div className="py-12 px-6 bg-gray-100">
            <h2 className="text-3xl font-bold text-center mb-8">Keycode Help Features</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <div key={feature.id} className="p-6 bg-white shadow-lg rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
    
};

export default Features;