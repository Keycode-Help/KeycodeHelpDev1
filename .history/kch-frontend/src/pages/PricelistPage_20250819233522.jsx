import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/IconProvider';

const PricelistPage = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);

  const pricingTiers = {
    monthly: [
      {
        name: 'Basic',
        price: 29.99,
        period: 'month',
        features: [
          'Up to 50 keycode requests',
          'Basic vehicle database access',
          'Email support',
          'Standard response time (24-48 hours)',
          'Basic reporting'
        ],
        popular: false,
        buttonText: 'Get Started',
        buttonVariant: 'btn-outline'
      },
      {
        name: 'Professional',
        price: 59.99,
        period: 'month',
        features: [
          'Up to 200 keycode requests',
          'Full vehicle database access',
          'Priority email support',
          'Faster response time (12-24 hours)',
          'Advanced reporting & analytics',
          'API access',
          'Custom integrations'
        ],
        popular: true,
        buttonText: 'Most Popular',
        buttonVariant: 'btn-primary'
      },
      {
        name: 'Enterprise',
        price: 149.99,
        period: 'month',
        features: [
          'Unlimited keycode requests',
          'Full vehicle database access',
          'Priority phone & email support',
          'Fastest response time (4-8 hours)',
          'Advanced reporting & analytics',
          'Full API access',
          'Custom integrations',
          'Dedicated account manager',
          'White-label options'
        ],
        popular: false,
        buttonText: 'Contact Sales',
        buttonVariant: 'btn-outline'
      }
    ],
    yearly: [
      {
        name: 'Basic',
        price: 299.99,
        period: 'year',
        features: [
          'Up to 50 keycode requests',
          'Basic vehicle database access',
          'Email support',
          'Standard response time (24-48 hours)',
          'Basic reporting',
          '2 months free'
        ],
        popular: false,
        buttonText: 'Get Started',
        buttonVariant: 'btn-outline'
      },
      {
        name: 'Professional',
        price: 599.99,
        period: 'year',
        features: [
          'Up to 200 keycode requests',
          'Full vehicle database access',
          'Priority email support',
          'Faster response time (12-24 hours)',
          'Advanced reporting & analytics',
          'API access',
          'Custom integrations',
          '2 months free'
        ],
        popular: true,
        buttonText: 'Most Popular',
        buttonVariant: 'btn-primary'
      },
      {
        name: 'Enterprise',
        price: 1499.99,
        period: 'year',
        features: [
          'Unlimited keycode requests',
          'Full vehicle database access',
          'Priority phone & email support',
          'Fastest response time (4-8 hours)',
          'Advanced reporting & analytics',
          'Full API access',
          'Custom integrations',
          'Dedicated account manager',
          'White-label options',
          '2 months free'
        ],
        popular: false,
        buttonText: 'Contact Sales',
        buttonVariant: 'btn-outline'
      }
    ]
  };

  const additionalServices = [
    {
      name: 'Rush Processing',
      description: 'Get your keycode within 2-4 hours',
      price: 19.99,
      period: 'per request'
    },
    {
      name: 'Bulk Processing',
      description: 'Process 100+ keycode requests at once',
      price: 0.50,
      period: 'per request'
    },
    {
      name: 'Custom Integration',
      description: 'Integrate with your existing systems',
      price: 299.99,
      period: 'one-time'
    },
    {
      name: 'Training & Support',
      description: 'On-site or virtual training sessions',
      price: 199.99,
      period: 'per session'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the perfect plan for your keycode needs. All plans include our comprehensive 
            vehicle database and expert support team.
          </p>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'monthly'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'yearly'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Yearly Billing
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingTiers[activeTab].map((tier, index) => (
              <div
                key={tier.name}
                className={`relative bg-gray-800 rounded-xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  tier.popular
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-gray-400 ml-2">/{tier.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Icon
                        name="check"
                        size={20}
                        className="text-green-400 mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full btn btn-lg ${tier.buttonVariant} ${
                    tier.popular ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Additional Services
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Need something specific? We offer additional services to meet your unique requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-6 border border-gray-600 hover:border-blue-500 transition-all duration-200"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-blue-400">${service.price}</span>
                  <span className="text-gray-400 text-sm">{service.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What's included in the keycode requests?
              </h3>
              <p className="text-gray-300">
                Each keycode request includes access to our comprehensive vehicle database, 
                expert analysis, and detailed documentation for your specific vehicle make and model.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I change my plan at any time?
              </h3>
              <p className="text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                immediately, and we'll prorate any billing adjustments.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-300">
                We offer a 30-day money-back guarantee. If you're not satisfied with our service, 
                we'll refund your subscription fee, no questions asked.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What kind of support do you provide?
              </h3>
              <p className="text-gray-300">
                All plans include email support. Professional and Enterprise plans include 
                priority support with faster response times. Enterprise also includes phone support 
                and a dedicated account manager.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of automotive professionals who trust KeyCode Help for their 
            keycode needs. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-lg btn-primary"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="btn btn-lg btn-outline"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricelistPage;
