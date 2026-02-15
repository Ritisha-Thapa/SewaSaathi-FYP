import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { myServices as initialServices } from '../../data/providerMockData';

const MyServices = () => {
  const [services, setServices] = useState(initialServices);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const toggleStatus = (id) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setEditPrice(service.price);
  };

  const saveEdit = (id) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, price: Number(editPrice) } : s
    ));
    setEditingId(null);
  };

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
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1B3C53]">{service.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{service.type}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {editingId === service.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </div>
                  ) : (
                    `Rs. ${service.price}`
                  )}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStatus(service.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      service.active ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        service.active ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  {editingId === service.id ? (
                    <div className="flex justify-end gap-2">
                       <button onClick={() => saveEdit(service.id)} className="text-green-600 hover:bg-green-50 p-1 rounded">
                         <Check size={18} />
                       </button>
                       <button onClick={() => setEditingId(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                         <X size={18} />
                       </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startEdit(service)}
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
      </div>
    </div>
  );
};

export default MyServices;
