import React from "react";
import { useQuery } from '@tanstack/react-query';
import { getMyRequests } from '../services/keycodes';

export default function KeycodeRequestsHistory() {
  const { data: requests, isLoading, error, refetch } = useQuery({ 
    queryKey: ['keycode-requests'], 
    queryFn: getMyRequests 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-white">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error loading requests: {error.message}</div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400">No keycode requests found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Your Keycode Requests</h3>
      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-white font-medium">VIN: {request.vin}</h4>
                <p className="text-gray-400 text-sm">Status: {request.status}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            {request.notes && (
              <p className="text-gray-300 text-sm mt-2">{request.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
