import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KeycodeGrid from '../components/KeycodeGrid';
import '../styles/keycode-portals.css';

const KeycodePortals = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [portalsData, setPortalsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user has admin or super_admin role
    if (user && user.role && !['admin', 'super_admin'].includes(user.role)) {
      navigate('/dashboard');
      return;
    }

    // Load portals data
    loadPortalsData();
  }, [isAuthenticated, user, navigate]);

  const loadPortalsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/src/config/keycode-portals.json');
      if (!response.ok) {
        throw new Error('Failed to load portals configuration');
      }
      const data = await response.json();
      setPortalsData(data);
    } catch (err) {
      console.error('Error loading portals data:', err);
      setError('Failed to load keycode portals configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading keycode portals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadPortalsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!portalsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Keycode portals configuration could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Keycode Portals</h1>
              <p className="mt-2 text-gray-600">
                VSP ID: <span className="font-mono font-semibold text-blue-600">{portalsData.meta.vsp_id}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authy Instructions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important: Download Authy App
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  To access these OEM keycode portals, you <strong>MUST</strong> download the Authy app for 
                  two-factor authentication. Many portals require 2FA for security compliance.
                </p>
                <div className="mt-3 flex space-x-4">
                  <a
                    href="https://apps.apple.com/us/app/authy/id494168017"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md text-sm font-medium text-yellow-800 bg-white hover:bg-yellow-50 transition-colors"
                  >
                    📱 iOS App Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.authy.authy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md text-sm font-medium text-yellow-800 bg-white hover:bg-yellow-50 transition-colors"
                  >
                    🤖 Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <KeycodeGrid portals={portalsData.manufacturers} />
      </div>
    </div>
  );
};

export default KeycodePortals;
