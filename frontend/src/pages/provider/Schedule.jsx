import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Loader2, Save } from 'lucide-react';
import { api } from '../../utils/api';
import Skeleton from '../../components/Skeleton';
import NotificationPopup from '../../components/common/NotificationPopup';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['09:00 AM - 12:00 PM', '12:00 PM - 03:00 PM', '03:00 PM - 06:00 PM'];

const Schedule = () => {
   const [loading, setLoading] = useState(true);
   const [isSaving, setIsSaving] = useState(false);
   const [availabilityId, setAvailabilityId] = useState(null);
   const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
   const [availability, setAvailability] = useState(
      days.reduce((acc, day) => ({ ...acc, [day]: true }), {})
   );

   useEffect(() => {
      fetchAvailability();
   }, []);

   const fetchAvailability = async () => {
      try {
         // The backend filters ProviderAvailability to the logged-in provider when queried
         const data = await api.get('/services/availability/');
         if (data && data.length > 0) {
            const userAvailability = data[0];
            setAvailabilityId(userAvailability.id);
            if (userAvailability.days && Object.keys(userAvailability.days).length > 0) {
               setAvailability(userAvailability.days);
            }
         }
      } catch (error) {
         console.error("Failed to fetch schedule", error);
      } finally {
         setLoading(false);
      }
   };

   const toggleDay = (day) => {
      setAvailability(prev => ({ ...prev, [day]: !prev[day] }));
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         if (availabilityId) {
            // Update existing availability
            await api.patch(`/services/availability/${availabilityId}/`, { days: availability });
         } else {
            // Create new availability record
            const response = await api.post('/services/availability/', { days: availability });
            setAvailabilityId(response.id);
         }
         setNotification({ isOpen: true, type: 'success', title: 'Schedule Saved', message: 'Your weekly schedule has been updated.' });
      } catch (error) {
         console.error("Failed to save schedule", error);
         setNotification({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to update schedule.' });
      } finally {
         setIsSaving(false);
      }
   };

   if (loading) {
      return (
         <div className="space-y-6">
            <Skeleton className="w-48 h-8 font-bold text-[#1B3C53]" />
            <Skeleton className="w-full h-96 rounded-xl" />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <h2 className="text-2xl font-bold text-[#1B3C53]">Schedule & Availability</h2>

         {/* Emergency Toggle */}
         {/* <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-800">Emergency Services</h3>
            <p className="text-sm text-red-600">Enable this to receive urgent job requests outside your normal schedule.</p>
          </div>
          <button 
            onClick={() => setEmergency(!emergency)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
                emergency ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-200'
            }`}
          >
             {emergency ? 'Enabled' : 'Disabled'}
          </button>
       </div> */}

         {/* Weekly Schedule */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1B3C53] mb-6">Weekly Availability</h3>

            <div className="space-y-4">
               {days.map((day) => (
                  <div key={day} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                     <div className="flex items-center gap-4">
                        <button
                           onClick={() => toggleDay(day)}
                           className={`text-2xl ${availability[day] ? 'text-green-500' : 'text-gray-300'}`}
                        >
                           {availability[day] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                        </button>
                        <span className={`font-medium ${availability[day] ? 'text-gray-800' : 'text-gray-400'}`}>
                           {day}
                        </span>
                     </div>

                     <div className="flex gap-2">
                        {timeSlots.map(slot => (
                           <div key={slot} className={`text-xs px-2 py-1 rounded bg-gray-100 text-gray-500 ${!availability[day] && 'opacity-50'}`}>
                              {slot}
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="flex justify-end">
            <button
               onClick={handleSave}
               disabled={isSaving}
               className="px-6 py-3 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248] font-medium flex items-center justify-center gap-2 disabled:opacity-75"
            >
               {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               Save Schedule Changes
            </button>
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

export default Schedule;
