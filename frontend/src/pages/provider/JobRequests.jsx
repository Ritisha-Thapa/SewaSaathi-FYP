import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
import { api } from '../../utils/api';

const JobRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.get('/api/booking/bookings/');
      // Filter for 'pending' or 'requested' status only, assuming backend returns all for provider
      // Adjust backend filtering if needed. Currently backend returns all for provider.
      // So we filter here.
      const pending = data.filter(b => b.status === 'pending' || b.status === 'requested');
      setRequests(pending);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
        const status = action === 'Accepted' ? 'accepted' : 'rejected';
        await api.post(`/api/booking/bookings/${id}/update-status/`, { status });
        
        // Remove from list
        setRequests(requests.filter(req => req.id !== id));
        alert(`Request ${action} successfully`);
    } catch (err) {
        console.error("Action failed", err);
        alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8">Loading requests...</div>;

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
                  <h3 className="font-bold text-[#1B3C53]">{req.service_name}</h3>
                  <div className="flex items-center text-sm text-blue-600 mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>Created: {new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-green-600">Rs. {req.total_price}</span>
                  <span className="text-xs text-gray-500">Total Price</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400" />
                  {req.customer_name || "Customer"}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {req.customer_address ? `${req.customer_address}, ${req.customer_city}` : "Location not provided"}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {req.scheduled_date} at {req.scheduled_time}
                </div>
                 {req.issue_description && (
                     <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                         "{req.issue_description}"
                     </div>
                 )}
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
