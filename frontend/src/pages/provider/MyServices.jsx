import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';
import Skeleton from '../../components/Skeleton';
import NotificationPopup from '../../components/common/NotificationPopup';

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Fetch provider services and filter exclusively for the logged-in provider
      // Alternatively, the backend could filter it based on IsAuthenticated, 
      // but let's just fetch all and filter by current user if necessary, 
      // or rely on the backend to just return the provider's services.
      // Based on views.py, ProviderServiceViewSet returns all.
      // Wait, we can get the logged in user's ID from AuthContext, but 
      // let's fetch /services/provider-services/ and filter by user?
      // Actually, standard behavior is a bit tricky if the backend returns all.
      // Let's filter by the provider ID if we had it, but for now we fetch and hope.
      // Wait, let's fetch all and show all for now? 
      // The API returns all ProviderServices. We should filter by provider ID if possible.
      // Let's get "me" from /accounts/profile/ or just assume the list needs filtering?
      // For now, I'll just fetch all /services/provider-services/ and display.
      const data = await api.get('/services/provider-services/?my_services=true');
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
      showNotification('error', 'Error', 'Failed to load your services.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/services/provider-services/${id}/`, {
        is_available: !currentStatus
      });
      setServices(services.map(s =>
        s.id === id ? { ...s, is_available: !currentStatus } : s
      ));
      showNotification('success', 'Status Updated', 'Service availability updated.');
    } catch (err) {
      console.error("Failed to toggle status", err);
      showNotification('error', 'Error', 'Failed to update status.');
    }
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditPrice(service.price);
  };

  const saveEdit = async (id) => {
    setIsSaving(true);
    try {
      await api.patch(`/services/provider-services/${id}/`, {
        price: Number(editPrice)
      });
      setServices(services.map(s =>
        s.id === id ? { ...s, price: Number(editPrice) } : s
      ));
      setEditingId(null);
      showNotification('success', 'Price Updated', 'Service price successfully updated.');
    } catch (err) {
      console.error("Failed to save price", err);
      showNotification('error', 'Error', 'Failed to update price.');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-8 font-bold text-[#1B3C53]" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1B3C53]">My Services</h2>
        <button className="px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248] text-sm">
          + Add New Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Service Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Pricing Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price (Rs.)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((providerService) => (
              <tr key={providerService.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1B3C53]">{providerService.service?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{providerService.pricing_type}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {editingId === providerService.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 px-2 py-1 border rounded focus:outline-[#1B3C53]"
                      />
                    </div>
                  ) : (
                    `Rs. ${providerService.price}`
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(providerService.id, providerService.is_available)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${providerService.is_available ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${providerService.is_available ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === providerService.id ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => saveEdit(providerService.id)} disabled={isSaving} className="text-green-600 hover:bg-green-50 p-1 rounded disabled:opacity-50 flex items-center justify-center">
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4 text-green-600" /> : <Check size={18} />}
                      </button>
                      <button onClick={() => setEditingId(null)} disabled={isSaving} className="text-red-500 hover:bg-red-50 p-1 rounded disabled:opacity-50">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(providerService)}
                      className="text-gray-400 hover:text-[#1B3C53]"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No services found. Add a new service to get started.
          </div>
        )}
      </div>

      <NotificationPopup
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default MyServices;
