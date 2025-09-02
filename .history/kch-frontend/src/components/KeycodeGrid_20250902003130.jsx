import React, { useState } from 'react';
import { ExternalLink, Copy, Shield, Clock, Key } from 'lucide-react';
import { keycodeService } from '../services/keycodeService';

const KeycodeGrid = ({ portals }) => {
  const [copyStatus, setCopyStatus] = useState({});
  const [loading, setLoading] = useState({});

  const handleLaunchPortal = (portal) => {
    if (portal.portal_url) {
      window.open(portal.portal_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyCredentials = async (portal) => {
    if (loading[portal.id]) return;

    setLoading(prev => ({ ...prev, [portal.id]: true }));
    setCopyStatus(prev => ({ ...prev, [portal.id]: '' }));

    try {
      const data = await keycodeService.getCredentials(portal.id);

      const credentials = `Username: ${data.username}\nPassword: ${data.password}`;
        
        try {
          await navigator.clipboard.writeText(credentials);
          setCopyStatus(prev => ({ 
            ...prev, 
            [portal.id]: 'Credentials copied to clipboard!' 
          }));
        } catch (clipboardError) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = credentials;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopyStatus(prev => ({ 
            ...prev, 
            [portal.id]: 'Credentials copied to clipboard!' 
          }));
        }
    } catch (error) {
      console.error('Error copying credentials:', error);
      let errorMessage = 'Failed to copy credentials';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid request';
            break;
          case 403:
            errorMessage = 'Access denied';
            break;
          case 404:
            errorMessage = 'Unknown OEM';
            break;
          case 409:
            errorMessage = 'Missing credentials. Update environment variables for this OEM.';
            break;
          case 429:
            errorMessage = 'Rate limit exceeded. Try again later.';
            break;
          default:
            errorMessage = error.response.data?.error || 'Failed to copy credentials';
        }
      }
      
      setCopyStatus(prev => ({ 
        ...prev, 
        [portal.id]: errorMessage
      }));
    } finally {
      setLoading(prev => ({ ...prev, [portal.id]: false }));
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [portal.id]: '' }));
      }, 3000);
    }
  };

  const getStatusBadge = (portal) => {
    if (portal.comingSoon) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Coming Soon
        </span>
      );
    }
    
    if (portal.sdrm) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Shield className="w-3 h-3 mr-1" />
          SDRM
        </span>
      );
    }
    
    return null;
  };

  const getActionButtons = (portal) => {
    if (!portal.portal_url) {
      return (
        <div className="text-sm text-gray-500 italic">
          Portal not available
        </div>
      );
    }

    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleLaunchPortal(portal)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Launch
        </button>
        <button
          onClick={() => handleCopyCredentials(portal)}
          disabled={loading[portal.id]}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading[portal.id] ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1"></div>
          ) : (
            <Copy className="w-4 h-4 mr-1" />
          )}
          Copy Creds
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {portals.map((portal) => (
        <div
          key={portal.id}
          className={`bg-white rounded-lg shadow-sm border ${
            !portal.portal_url ? 'opacity-75' : ''
          } hover:shadow-md transition-shadow`}
        >
          {/* Card Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
                  {/* Vehicle Logo */}
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                    <img
                      src={getVehicleLogo(portal.name)}
                      alt={portal.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback icon when logo fails to load */}
                    <div className="hidden w-6 h-6 text-gray-400">
                      <Key className="w-full h-full" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {portal.name}
                  </h3>
                </div>
                {getStatusBadge(portal)}
              </div>
              <div className="flex-shrink-0 ml-2">
                <Key className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4">
            {/* Notes */}
            {portal.notes && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {portal.notes}
                </p>
              </div>
            )}



            {/* Action Buttons */}
            {getActionButtons(portal)}

            {/* Status Message */}
            {copyStatus[portal.id] && (
              <div className={`mt-3 p-2 rounded-md text-sm ${
                copyStatus[portal.id].includes('Failed') || copyStatus[portal.id].includes('error')
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {copyStatus[portal.id]}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeycodeGrid;
