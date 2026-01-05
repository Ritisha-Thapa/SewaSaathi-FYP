import React, { useState } from 'react';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
import { jobRequests as initialRequests } from '../../data/providerMockData';

const JobRequests = () => {
  const [requests, setRequests] = useState(initialRequests);

  const handleAction = (id, action) => {
    // In real app, API call here
    alert(`${action} request #${id}`);
    setRequests(requests.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">Incoming Job Requests</h2>

      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No pending requests at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#1B3C53]">{req.serviceName}</h3>
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>Expires in {Math.floor(req.expiresIn / 60)} mins</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-green-600">Rs. {req.estimatedPrice}</span>
                  <span className="text-xs text-gray-500">Est. Price</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400" />
                  {req.customerName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {req.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {req.dateTime}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 flex gap-3">
                <button 
                  onClick={() => handleAction(req.id, 'Rejected')}
                  className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'Accepted')}
                  className="flex-1 px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248] text-sm font-medium transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRequests;
