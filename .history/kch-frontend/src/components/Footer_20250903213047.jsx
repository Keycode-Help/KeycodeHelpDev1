import React from "react";
import { Link } from "react-router-dom";
import { Key, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Key className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                  Keycode Help
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Professional vehicle keycode lookup services. Get accurate,
                reliable keycode information for your automotive needs with our
                comprehensive database.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>support@keycode.help</span>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Professional Automotive Services</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-white mb-6 relative">
                  Quick Links
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full"></div>
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/support"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/requirements"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Requirements
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Legal & Policies */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-white mb-6 relative">
                  Legal & Policies
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full"></div>
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms-of-service"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/refund-policy"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/membership-cancellation"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Cancellation Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} KeyCode Help. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <Link
                  to="/pricing"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Keycode Pricing
                </Link>
                <span className="text-slate-600">•</span>
                <Link
                  to="/support"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Support
                </Link>
                <span className="text-slate-600">•</span>
                <Link
                  to="/requirements"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Requirements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
