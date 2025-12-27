import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import plumbingImg from '../assets/images/services/plumbing.png';
import electricalImg from '../assets/images/services/electrical.png';
import cleaningImg from '../assets/images/services/cleaning.png';
import gardeningImg from '../assets/images/services/gardening.png';
import paintingImg from '../assets/images/services/painting.png';
import Footer from '../components/Footer';

const DATA = {
  plumbing: {
    'tap-repair': { title: 'Tap Repair', desc: 'Professional repair for leaking or faulty taps using quality components.', basePrice: 500, image: plumbingImg },
    'bathtub-repair': { title: 'Bathtub Repair', desc: 'Crack sealing, fixture replacement, and plumbing alignment for bathtubs.', basePrice: 1500, image: plumbingImg },
    'pipe-leakage-repair': { title: 'Water Pipe Leakage Repair', desc: 'Leak detection and targeted pipe repair with durable fittings.', basePrice: 1200, image: plumbingImg },
    'drain-unclogging': { title: 'Drain Unclogging', desc: 'Mechanical and chemical treatment to clear clogged drains.', basePrice: 800, image: plumbingImg },
  },
  electrical: {
    'wiring-fix': { title: 'Wiring Fix', desc: 'Troubleshooting and fixing faulty electrical wiring and circuits.', basePrice: 1000, image: electricalImg },
    'socket-install': { title: 'Socket Install', desc: 'Install and test new power sockets with safety checks.', basePrice: 700, image: electricalImg },
    'lighting-setup': { title: 'Lighting Setup', desc: 'Install energy-efficient indoor or outdoor lighting systems.', basePrice: 900, image: electricalImg },
  },
  cleaning: {
    'deep-clean': { title: 'Deep Clean', desc: 'Top-to-bottom cleaning and sanitation for kitchens, bathrooms, and living areas.', basePrice: 2000, image: cleaningImg },
    'kitchen-clean': { title: 'Kitchen Clean', desc: 'Degreasing, stain removal, and surface sanitization for kitchen areas.', basePrice: 1200, image: cleaningImg },
  },
  gardening: {
    'lawn-care': { title: 'Lawn Care', desc: 'Mowing, edging, and general lawn maintenance service.', basePrice: 600, image: gardeningImg },
    'hedge-trim': { title: 'Hedge Trim', desc: 'Shaping and trimming hedges and shrubs.', basePrice: 700, image: gardeningImg },
  },
  painting: {
    'interior-room': { title: 'Interior Room', desc: 'Single-room interior painting with prep and finish.', basePrice: 2500, image: paintingImg },
    'exterior-wall': { title: 'Exterior Wall', desc: 'Exterior wall painting with weather-resistant finish.', basePrice: 4000, image: paintingImg },
  },
};

const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

const ServiceDetails = () => {
  const { category, serviceSlug } = useParams();
  const item = useMemo(() => {
    const group = DATA[category] || {};
    return group[serviceSlug];
  }, [category, serviceSlug]);

  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-700">Service not found.</p>
          <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">Back to {category}</Link>
        </div>
      </div>
    );
  }

  const insurance = Math.round(item.basePrice * 0.01);
  const total = item.basePrice + insurance;

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="container mx-auto px-4 max-w-5xl py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#1B3C53]">{item.title}</h2>
          <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">Back to {category}</Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
          <div className="p-6 space-y-4">
            <p className="text-gray-700">{item.desc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-600">Base price</div>
                <div className="text-lg font-semibold">{formatPrice(item.basePrice)}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-600">Insurance fee (1%)</div>
                <div className="text-lg font-semibold">{formatPrice(insurance)}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-lg font-semibold">{formatPrice(total)}</div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold text-[#1B3C53]">Booking</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Time Slot</label>
                  <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent">
                    <option value="">Select a slot</option>
                    <option value="9-11">9:00 AM - 11:00 AM</option>
                    <option value="11-1">11:00 AM - 1:00 PM</option>
                    <option value="2-4">2:00 PM - 4:00 PM</option>
                    <option value="4-6">4:00 PM - 6:00 PM</option>
                  </select>
                </div>
              </div>
              <button className="inline-flex items-center justify-center px-6 py-2 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]">Book Now</button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ServiceDetails;

// import React, { useMemo, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import plumbingImg from '../assets/images/services/plumbing.png';
// import electricalImg from '../assets/images/services/electrical.png';
// import cleaningImg from '../assets/images/services/cleaning.png';
// import gardeningImg from '../assets/images/services/gardening.png';
// import paintingImg from '../assets/images/services/painting.png';
// import Footer from '../components/Footer';

// const DATA = {
//   plumbing: {
//     'tap-repair': { title: 'Tap Repair', desc: 'Professional repair for leaking or faulty taps using quality components.', basePrice: 500, image: plumbingImg },
//     'bathtub-repair': { title: 'Bathtub Repair', desc: 'Crack sealing, fixture replacement, and plumbing alignment for bathtubs.', basePrice: 1500, image: plumbingImg },
//     'pipe-leakage-repair': { title: 'Water Pipe Leakage Repair', desc: 'Leak detection and targeted pipe repair with durable fittings.', basePrice: 1200, image: plumbingImg },
//     'drain-unclogging': { title: 'Drain Unclogging', desc: 'Mechanical and chemical treatment to clear clogged drains.', basePrice: 800, image: plumbingImg },
//   },
//   electrical: {
//     'wiring-fix': { title: 'Wiring Fix', desc: 'Troubleshooting and fixing faulty electrical wiring and circuits.', basePrice: 1000, image: electricalImg },
//     'socket-install': { title: 'Socket Install', desc: 'Install and test new power sockets with safety checks.', basePrice: 700, image: electricalImg },
//     'lighting-setup': { title: 'Lighting Setup', desc: 'Install energy-efficient indoor or outdoor lighting systems.', basePrice: 900, image: electricalImg },
//   },
//   cleaning: {
//     'deep-clean': { title: 'Deep Clean', desc: 'Top-to-bottom cleaning and sanitation for kitchens, bathrooms, and living areas.', basePrice: 2000, image: cleaningImg },
//     'kitchen-clean': { title: 'Kitchen Clean', desc: 'Degreasing, stain removal, and surface sanitization for kitchen areas.', basePrice: 1200, image: cleaningImg },
//   },
//   gardening: {
//     'lawn-care': { title: 'Lawn Care', desc: 'Mowing, edging, and general lawn maintenance service.', basePrice: 600, image: gardeningImg },
//     'hedge-trim': { title: 'Hedge Trim', desc: 'Shaping and trimming hedges and shrubs.', basePrice: 700, image: gardeningImg },
//   },
//   painting: {
//     'interior-room': { title: 'Interior Room', desc: 'Single-room interior painting with prep and finish.', basePrice: 2500, image: paintingImg },
//     'exterior-wall': { title: 'Exterior Wall', desc: 'Exterior wall painting with weather-resistant finish.', basePrice: 4000, image: paintingImg },
//   },
// };

// const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

// const ServiceDetails = () => {
//   const { category, serviceSlug } = useParams();

//   const item = useMemo(() => {
//     const group = DATA[category] || {};
//     return group[serviceSlug];
//   }, [category, serviceSlug]);

//   const [date, setDate] = useState('');
//   const [slot, setSlot] = useState('');

//   const isValidTime = (selectedDate, selectedSlot) => {
//     if (!selectedDate || !selectedSlot) return false;

//     const now = new Date();
//     const [startHour] = selectedSlot.split('-').map(Number);

//     const selected = new Date(selectedDate);
//     selected.setHours(startHour, 0, 0, 0);

//     const diffHours = (selected - now) / (1000 * 60 * 60);
//     return diffHours >= 2;
//   };

//   const handleRequest = () => {
//     if (!date || !slot) {
//       alert("Please select both date and time.");
//       return;
//     }

//     if (!isValidTime(date, slot)) {
//       alert("Service must be requested at least 2 hours in advance.");
//       return;
//     }

//     alert("Service request submitted. A provider will respond within 20 minutes.");
//   };

//   if (!item) {
//     return (
//       <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center px-4">
//         <div className="text-center">
//           <p className="text-lg text-gray-700">Service not found.</p>
//           <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">
//             Back to {category}
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F9F5F0]">
//       <div className="container mx-auto px-4 max-w-5xl py-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-3xl font-bold text-[#1B3C53]">{item.title}</h2>
//           <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">
//             Back to {category}
//           </Link>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />

//           <div className="p-6 space-y-4">
//             <p className="text-gray-700">{item.desc}</p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="p-4 rounded-lg bg-gray-50">
//                 <div className="text-sm text-gray-600">Starting price</div>
//                 <div className="text-lg font-semibold">{formatPrice(item.basePrice)}</div>
//               </div>

//               <div className="p-4 rounded-lg bg-gray-50">
//                 <div className="text-sm text-gray-600">Insurance</div>
//                 <div className="text-sm text-gray-700">+1% service insurance included</div>
//               </div>
//             </div>

//             <div className="mt-6 space-y-4">
//               <h3 className="text-xl font-semibold text-[#1B3C53]">Request Service</h3>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Date</label>
//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Time Slot</label>
//                   <select
//                     value={slot}
//                     onChange={(e) => setSlot(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
//                   >
//                     <option value="">Select a slot</option>
//                     <option value="9-11">9:00 AM - 11:00 AM</option>
//                     <option value="11-1">11:00 AM - 1:00 PM</option>
//                     <option value="2-4">2:00 PM - 4:00 PM</option>
//                     <option value="4-6">4:00 PM - 6:00 PM</option>
//                   </select>
//                 </div>
//               </div>

//               <button
//                 onClick={handleRequest}
//                 className="inline-flex items-center justify-center px-6 py-2 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]"
//               >
//                 Request Service
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ServiceDetails;



// import React, { useMemo, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import plumbingImg from '../assets/images/services/plumbing.png';
// import electricalImg from '../assets/images/services/electrical.png';
// import cleaningImg from '../assets/images/services/cleaning.png';
// import gardeningImg from '../assets/images/services/gardening.png';
// import paintingImg from '../assets/images/services/painting.png';
// import Footer from '../components/Footer';

// const DATA = {
//   plumbing: {
//     'tap-repair': { title: 'Tap Repair', desc: 'Professional repair for leaking or faulty taps using quality components.', basePrice: 500, image: plumbingImg },
//     'bathtub-repair': { title: 'Bathtub Repair', desc: 'Crack sealing, fixture replacement, and plumbing alignment for bathtubs.', basePrice: 1500, image: plumbingImg },
//   },
//   electrical: {
//     'wiring-fix': { title: 'Wiring Fix', desc: 'Troubleshooting and fixing faulty electrical wiring and circuits.', basePrice: 1000, image: electricalImg },
//   },
//   cleaning: {
//     'deep-clean': { title: 'Deep Clean', desc: 'Top-to-bottom cleaning and sanitation for kitchens, bathrooms, and living areas.', basePrice: 2000, image: cleaningImg },
//   },
//   gardening: {
//     'lawn-care': { title: 'Lawn Care', desc: 'Mowing, edging, and general lawn maintenance service.', basePrice: 600, image: gardeningImg },
//   },
//   painting: {
//     'interior-room': { title: 'Interior Room', desc: 'Single-room interior painting with prep and finish.', basePrice: 2500, image: paintingImg },
//   },
// };

// const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

// const ServiceDetails = () => {
//   const { category, serviceSlug } = useParams();

//   const item = useMemo(() => {
//     const group = DATA[category] || {};
//     return group[serviceSlug];
//   }, [category, serviceSlug]);

//   const [date, setDate] = useState('');
//   const [slot, setSlot] = useState('');
//   const [isWaiting, setIsWaiting] = useState(false);

//   const isValidTime = (selectedDate, selectedSlot) => {
//     if (!selectedDate || !selectedSlot) return false;

//     const now = new Date();
//     const [startHour] = selectedSlot.split('-').map(Number);

//     const selected = new Date(selectedDate);
//     selected.setHours(startHour, 0, 0, 0);

//     return (selected - now) / (1000 * 60 * 60) >= 2;
//   };

//   const handleRequest = () => {
//     if (!date || !slot) {
//       alert("Please select both date and time.");
//       return;
//     }

//     if (!isValidTime(date, slot)) {
//       alert("Service must be requested at least 2 hours in advance.");
//       return;
//     }

//     setIsWaiting(true);
//   };

//   if (!item) {
//     return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#F9F5F0] relative">
      
//       {/* WAITING MODAL */}
//       {isWaiting && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-8 w-[90%] max-w-md text-center shadow-xl">
            
//             <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            
//             <h3 className="text-xl font-semibold text-[#1B3C53] mb-2">
//               Waiting for provider
//             </h3>

//             <p className="text-gray-600 text-sm">
//               Your request has been sent to nearby providers.
//               <br />
//               Response expected within <b>20 minutes</b>.
//             </p>

//             <div className="mt-4 text-xs text-gray-500">
//               Admin will assign a provider if no one responds.
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 max-w-5xl py-10">
//         <h2 className="text-3xl font-bold text-[#1B3C53] mb-4">{item.title}</h2>

//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />

//           <div className="p-6 space-y-4">
//             <p className="text-gray-700">{item.desc}</p>

//             <div className="p-4 bg-gray-50 rounded-lg">
//               <div className="text-sm text-gray-600">Starting price</div>
//               <div className="text-lg font-semibold">{formatPrice(item.basePrice)}</div>
//               <div className="text-xs text-gray-500 mt-1">+1% insurance applied after completion</div>
//             </div>

//             <h3 className="text-xl font-semibold text-[#1B3C53]">Request Service</h3>

//             <div className="grid sm:grid-cols-2 gap-4">
//               <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg px-3 py-2" />
//               <select value={slot} onChange={(e) => setSlot(e.target.value)} className="border rounded-lg px-3 py-2">
//                 <option value="">Select time slot</option>
//                 <option value="9-11">9:00 – 11:00</option>
//                 <option value="11-1">11:00 – 1:00</option>
//                 <option value="2-4">2:00 – 4:00</option>
//                 <option value="4-6">4:00 – 6:00</option>
//               </select>
//             </div>

//             <button
//               onClick={handleRequest}
//               disabled={isWaiting}
//               className="mt-4 px-6 py-2 rounded-full text-white bg-[#1B3C53] disabled:opacity-60"
//             >
//               Request Service
//             </button>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default ServiceDetails;
