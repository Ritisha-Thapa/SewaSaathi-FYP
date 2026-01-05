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

//   if (!item) {
//     return (
//       <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center px-4">
//         <div className="text-center">
//           <p className="text-lg text-gray-700">Service not found.</p>
//           <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">Back to {category}</Link>
//         </div>
//       </div>
//     );
//   }

//   const insurance = Math.round(item.basePrice * 0.01);
//   const total = item.basePrice + insurance;

//   return (
//     <div className="min-h-screen bg-[#F9F5F0]">
//       <div className="container mx-auto px-4 max-w-5xl py-10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-3xl font-bold text-[#1B3C53]">{item.title}</h2>
//           <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">Back to {category}</Link>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
//           <div className="p-6 space-y-4">
//             <p className="text-gray-700">{item.desc}</p>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="p-4 rounded-lg bg-gray-50">
//                 <div className="text-sm text-gray-600">Base price</div>
//                 <div className="text-lg font-semibold">{formatPrice(item.basePrice)}</div>
//               </div>
//               <div className="p-4 rounded-lg bg-gray-50">
//                 <div className="text-sm text-gray-600">Insurance fee (1%)</div>
//                 <div className="text-lg font-semibold">{formatPrice(insurance)}</div>
//               </div>
//               <div className="p-4 rounded-lg bg-gray-50">
//                 <div className="text-sm text-gray-600">Total</div>
//                 <div className="text-lg font-semibold">{formatPrice(total)}</div>
//               </div>
//             </div>

//             <div className="mt-6 space-y-4">
//               <h3 className="text-xl font-semibold text-[#1B3C53]">Booking</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Date</label>
//                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent" />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1">Time Slot</label>
//                   <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent">
//                     <option value="">Select a slot</option>
//                     <option value="9-11">9:00 AM - 11:00 AM</option>
//                     <option value="11-1">11:00 AM - 1:00 PM</option>
//                     <option value="2-4">2:00 PM - 4:00 PM</option>
//                     <option value="4-6">4:00 PM - 6:00 PM</option>
//                   </select>
//                 </div>
//               </div>
//               <button className="inline-flex items-center justify-center px-6 py-2 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]">Book Now</button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer/>
//     </div>
//   );
// };

// export default ServiceDetails;

// // import React, { useMemo, useState } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import plumbingImg from '../assets/images/services/plumbing.png';
// // import electricalImg from '../assets/images/services/electrical.png';
// // import cleaningImg from '../assets/images/services/cleaning.png';
// // import gardeningImg from '../assets/images/services/gardening.png';
// // import paintingImg from '../assets/images/services/painting.png';
// // import Footer from '../components/Footer';

// // const DATA = {
// //   plumbing: {
// //     'tap-repair': { title: 'Tap Repair', desc: 'Professional repair for leaking or faulty taps using quality components.', basePrice: 500, image: plumbingImg },
// //     'bathtub-repair': { title: 'Bathtub Repair', desc: 'Crack sealing, fixture replacement, and plumbing alignment for bathtubs.', basePrice: 1500, image: plumbingImg },
// //     'pipe-leakage-repair': { title: 'Water Pipe Leakage Repair', desc: 'Leak detection and targeted pipe repair with durable fittings.', basePrice: 1200, image: plumbingImg },
// //     'drain-unclogging': { title: 'Drain Unclogging', desc: 'Mechanical and chemical treatment to clear clogged drains.', basePrice: 800, image: plumbingImg },
// //   },
// //   electrical: {
// //     'wiring-fix': { title: 'Wiring Fix', desc: 'Troubleshooting and fixing faulty electrical wiring and circuits.', basePrice: 1000, image: electricalImg },
// //     'socket-install': { title: 'Socket Install', desc: 'Install and test new power sockets with safety checks.', basePrice: 700, image: electricalImg },
// //     'lighting-setup': { title: 'Lighting Setup', desc: 'Install energy-efficient indoor or outdoor lighting systems.', basePrice: 900, image: electricalImg },
// //   },
// //   cleaning: {
// //     'deep-clean': { title: 'Deep Clean', desc: 'Top-to-bottom cleaning and sanitation for kitchens, bathrooms, and living areas.', basePrice: 2000, image: cleaningImg },
// //     'kitchen-clean': { title: 'Kitchen Clean', desc: 'Degreasing, stain removal, and surface sanitization for kitchen areas.', basePrice: 1200, image: cleaningImg },
// //   },
// //   gardening: {
// //     'lawn-care': { title: 'Lawn Care', desc: 'Mowing, edging, and general lawn maintenance service.', basePrice: 600, image: gardeningImg },
// //     'hedge-trim': { title: 'Hedge Trim', desc: 'Shaping and trimming hedges and shrubs.', basePrice: 700, image: gardeningImg },
// //   },
// //   painting: {
// //     'interior-room': { title: 'Interior Room', desc: 'Single-room interior painting with prep and finish.', basePrice: 2500, image: paintingImg },
// //     'exterior-wall': { title: 'Exterior Wall', desc: 'Exterior wall painting with weather-resistant finish.', basePrice: 4000, image: paintingImg },
// //   },
// // };

// // const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

// // const ServiceDetails = () => {
// //   const { category, serviceSlug } = useParams();

// //   const item = useMemo(() => {
// //     const group = DATA[category] || {};
// //     return group[serviceSlug];
// //   }, [category, serviceSlug]);

// //   const [date, setDate] = useState('');
// //   const [slot, setSlot] = useState('');

// //   const isValidTime = (selectedDate, selectedSlot) => {
// //     if (!selectedDate || !selectedSlot) return false;

// //     const now = new Date();
// //     const [startHour] = selectedSlot.split('-').map(Number);

// //     const selected = new Date(selectedDate);
// //     selected.setHours(startHour, 0, 0, 0);

// //     const diffHours = (selected - now) / (1000 * 60 * 60);
// //     return diffHours >= 2;
// //   };

// //   const handleRequest = () => {
// //     if (!date || !slot) {
// //       alert("Please select both date and time.");
// //       return;
// //     }

// //     if (!isValidTime(date, slot)) {
// //       alert("Service must be requested at least 2 hours in advance.");
// //       return;
// //     }

// //     alert("Service request submitted. A provider will respond within 20 minutes.");
// //   };

// //   if (!item) {
// //     return (
// //       <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center px-4">
// //         <div className="text-center">
// //           <p className="text-lg text-gray-700">Service not found.</p>
// //           <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">
// //             Back to {category}
// //           </Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#F9F5F0]">
// //       <div className="container mx-auto px-4 max-w-5xl py-10">
// //         <div className="flex items-center justify-between mb-6">
// //           <h2 className="text-3xl font-bold text-[#1B3C53]">{item.title}</h2>
// //           <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248]">
// //             Back to {category}
// //           </Link>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //           <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />

// //           <div className="p-6 space-y-4">
// //             <p className="text-gray-700">{item.desc}</p>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <div className="p-4 rounded-lg bg-gray-50">
// //                 <div className="text-sm text-gray-600">Starting price</div>
// //                 <div className="text-lg font-semibold">{formatPrice(item.basePrice)}</div>
// //               </div>

// //               <div className="p-4 rounded-lg bg-gray-50">
// //                 <div className="text-sm text-gray-600">Insurance</div>
// //                 <div className="text-sm text-gray-700">+1% service insurance included</div>
// //               </div>
// //             </div>

// //             <div className="mt-6 space-y-4">
// //               <h3 className="text-xl font-semibold text-[#1B3C53]">Request Service</h3>

// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //                 <div>
// //                   <label className="block text-sm text-gray-700 mb-1">Date</label>
// //                   <input
// //                     type="date"
// //                     value={date}
// //                     onChange={(e) => setDate(e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm text-gray-700 mb-1">Time Slot</label>
// //                   <select
// //                     value={slot}
// //                     onChange={(e) => setSlot(e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
// //                   >
// //                     <option value="">Select a slot</option>
// //                     <option value="9-11">9:00 AM - 11:00 AM</option>
// //                     <option value="11-1">11:00 AM - 1:00 PM</option>
// //                     <option value="2-4">2:00 PM - 4:00 PM</option>
// //                     <option value="4-6">4:00 PM - 6:00 PM</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <button
// //                 onClick={handleRequest}
// //                 className="inline-flex items-center justify-center px-6 py-2 rounded-full text-white bg-[#1B3C53] hover:bg-[#1a3248]"
// //               >
// //                 Request Service
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default ServiceDetails;



// // import React, { useMemo, useState } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import plumbingImg from '../assets/images/services/plumbing.png';
// // import electricalImg from '../assets/images/services/electrical.png';
// // import cleaningImg from '../assets/images/services/cleaning.png';
// // import gardeningImg from '../assets/images/services/gardening.png';
// // import paintingImg from '../assets/images/services/painting.png';
// // import Footer from '../components/Footer';

// // const DATA = {
// //   plumbing: {
// //     'tap-repair': { title: 'Tap Repair', desc: 'Professional repair for leaking or faulty taps using quality components.', basePrice: 500, image: plumbingImg },
// //     'bathtub-repair': { title: 'Bathtub Repair', desc: 'Crack sealing, fixture replacement, and plumbing alignment for bathtubs.', basePrice: 1500, image: plumbingImg },
// //   },
// //   electrical: {
// //     'wiring-fix': { title: 'Wiring Fix', desc: 'Troubleshooting and fixing faulty electrical wiring and circuits.', basePrice: 1000, image: electricalImg },
// //   },
// //   cleaning: {
// //     'deep-clean': { title: 'Deep Clean', desc: 'Top-to-bottom cleaning and sanitation for kitchens, bathrooms, and living areas.', basePrice: 2000, image: cleaningImg },
// //   },
// //   gardening: {
// //     'lawn-care': { title: 'Lawn Care', desc: 'Mowing, edging, and general lawn maintenance service.', basePrice: 600, image: gardeningImg },
// //   },
// //   painting: {
// //     'interior-room': { title: 'Interior Room', desc: 'Single-room interior painting with prep and finish.', basePrice: 2500, image: paintingImg },
// //   },
// // };

// // const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

// // const ServiceDetails = () => {
// //   const { category, serviceSlug } = useParams();

// //   const item = useMemo(() => {
// //     const group = DATA[category] || {};
// //     return group[serviceSlug];
// //   }, [category, serviceSlug]);

// //   const [date, setDate] = useState('');
// //   const [slot, setSlot] = useState('');
// //   const [isWaiting, setIsWaiting] = useState(false);

// //   const isValidTime = (selectedDate, selectedSlot) => {
// //     if (!selectedDate || !selectedSlot) return false;

// //     const now = new Date();
// //     const [startHour] = selectedSlot.split('-').map(Number);

// //     const selected = new Date(selectedDate);
// //     selected.setHours(startHour, 0, 0, 0);

// //     return (selected - now) / (1000 * 60 * 60) >= 2;
// //   };

// //   const handleRequest = () => {
// //     if (!date || !slot) {
// //       alert("Please select both date and time.");
// //       return;
// //     }

// //     if (!isValidTime(date, slot)) {
// //       alert("Service must be requested at least 2 hours in advance.");
// //       return;
// //     }

// //     setIsWaiting(true);
// //   };

// //   if (!item) {
// //     return <div className="min-h-screen flex items-center justify-center">Service not found</div>;
// //   }

// //   return (
// //     <div className="min-h-screen bg-[#F9F5F0] relative">
      
// //       {/* WAITING MODAL */}
// //       {isWaiting && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-xl p-8 w-[90%] max-w-md text-center shadow-xl">
            
// //             <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            
// //             <h3 className="text-xl font-semibold text-[#1B3C53] mb-2">
// //               Waiting for provider
// //             </h3>

// //             <p className="text-gray-600 text-sm">
// //               Your request has been sent to nearby providers.
// //               <br />
// //               Response expected within <b>20 minutes</b>.
// //             </p>

// //             <div className="mt-4 text-xs text-gray-500">
// //               Admin will assign a provider if no one responds.
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div className="container mx-auto px-4 max-w-5xl py-10">
// //         <h2 className="text-3xl font-bold text-[#1B3C53] mb-4">{item.title}</h2>

// //         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
// //           <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />

// //           <div className="p-6 space-y-4">
// //             <p className="text-gray-700">{item.desc}</p>

// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <div className="text-sm text-gray-600">Starting price</div>
// //               <div className="text-lg font-semibold">{formatPrice(item.basePrice)}</div>
// //               <div className="text-xs text-gray-500 mt-1">+1% insurance applied after completion</div>
// //             </div>

// //             <h3 className="text-xl font-semibold text-[#1B3C53]">Request Service</h3>

// //             <div className="grid sm:grid-cols-2 gap-4">
// //               <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg px-3 py-2" />
// //               <select value={slot} onChange={(e) => setSlot(e.target.value)} className="border rounded-lg px-3 py-2">
// //                 <option value="">Select time slot</option>
// //                 <option value="9-11">9:00 – 11:00</option>
// //                 <option value="11-1">11:00 – 1:00</option>
// //                 <option value="2-4">2:00 – 4:00</option>
// //                 <option value="4-6">4:00 – 6:00</option>
// //               </select>
// //             </div>

// //             <button
// //               onClick={handleRequest}
// //               disabled={isWaiting}
// //               className="mt-4 px-6 py-2 rounded-full text-white bg-[#1B3C53] disabled:opacity-60"
// //             >
// //               Request Service
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default ServiceDetails;

import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import plumbingImg from '../../assets/images/services/plumbing.png';
import electricalImg from '../../assets/images/services/electrical.png';
import cleaningImg from '../../assets/images/services/cleaning.png';
import gardeningImg from '../../assets/images/services/gardening.png';
import paintingImg from '../../assets/images/services/painting.png';
import Footer from '../../components/customer/Footer';

const DATA = {
  plumbing: {
    'tap-repair': { title: 'Tap Repair', desc: 'Expert tap repair services to fix leaks and ensure smooth water flow. We use high-quality washers and components to prevent future drips, ensuring a long-lasting solution for your kitchen or bathroom.', basePrice: 500, image: plumbingImg },
    'bathtub-repair': { title: 'Bathtub Repair', desc: 'Comprehensive bathtub repair restoring cracks, chips, and surface damage. Our skilled technicians ensure a watertight seal and a pristine finish, bringing your bathtub back to its original glory.', basePrice: 1500, image: plumbingImg },
    'pipe-leakage-repair': { title: 'Water Pipe Leakage Repair', desc: 'Advanced leak detection and repair for hidden and exposed pipes. We use durable fittings and professional techniques to stop water waste and prevent structural damage to your property.', basePrice: 1200, image: plumbingImg },
    'drain-unclogging': { title: 'Drain Unclogging', desc: 'Fast and effective drain cleaning using safe mechanical and chemical methods. We remove stubborn blockages to restore proper drainage and hygiene to your sinks and showers.', basePrice: 800, image: plumbingImg },
  },
  electrical: {
    'wiring-fix': { title: 'Wiring Fix', desc: 'Safe and reliable wiring repair services. Our certified electricians diagnose and fix complex wiring issues, ensuring your home\'s electrical system is code-compliant and hazard-free.', basePrice: 1000, image: electricalImg },
    'socket-install': { title: 'Socket Install', desc: 'Professional installation of power sockets and switches. We test every connection for safety and durability, providing you with reliable power access exactly where you need it.', basePrice: 700, image: electricalImg },
    'lighting-setup': { title: 'Lighting Setup', desc: 'Transform your space with our premium lighting installation services. From energy-efficient LEDs to elegant fixtures, we enhance the ambiance and functionality of your indoor and outdoor areas.', basePrice: 900, image: electricalImg },
  },
  cleaning: {
    'deep-clean': { title: 'Deep Clean', desc: 'A thorough top-to-bottom cleaning service that leaves no corner untouched. We sanitize and scrub every surface, ensuring a sparkling clean and healthy environment for your family.', basePrice: 2000, image: cleaningImg },
    'kitchen-clean': { title: 'Kitchen Clean', desc: 'Specialized kitchen cleaning to remove tough grease and grime. We deep clean appliances, countertops, and cabinets, restoring hygiene and shine to the heart of your home.', basePrice: 1200, image: cleaningImg },
  },
  gardening: {
    'lawn-care': { title: 'Lawn Care', desc: 'Complete lawn maintenance including mowing, edging, and fertilizing. We keep your grass healthy, green, and perfectly manicured for a beautiful outdoor space.', basePrice: 600, image: gardeningImg },
    'hedge-trim': { title: 'Hedge Trim', desc: 'Precision hedge trimming and shaping to enhance your garden\'s aesthetics. Our gardeners promote healthy growth while keeping your shrubs and bushes neat and tidy.', basePrice: 700, image: gardeningImg },
  },
  painting: {
    'interior-room': { title: 'Interior Room', desc: 'Flawless interior painting with attention to detail. We handle all prep work, including sanding and priming, to deliver a smooth, durable, and vibrant finish that transforms your room.', basePrice: 2500, image: paintingImg },
    'exterior-wall': { title: 'Exterior Wall', desc: 'High-quality exterior painting designed to withstand the elements. We use weather-resistant paints and professional application techniques to protect and beautify your home\'s facade.', basePrice: 4000, image: paintingImg },
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
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState(''); // '', 'finding', 'found'
  const [errorMessage, setErrorMessage] = useState('');

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F9F5F0] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-700">Service not found.</p>
          <Link to={`/services/${category}`} className="text-[#1B3C53] hover:text-[#1a3248] inline-flex items-center gap-2 mt-4">
            <ArrowLeft size={20} />
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  const handleRequestService = () => {
    setErrorMessage('');
    setStatus('');

    if (!date || !time || !address || !phone) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const convertTo24Hour = (timeStr) => {
        const [timePart, modifier] = timeStr.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    };

    const time24 = convertTo24Hour(time);
    const selectedDateTime = new Date(`${date}T${time24}`);
    const now = new Date();
    const diffInHours = (selectedDateTime - now) / (1000 * 60 * 60);

    if (diffInHours < 2) {
      setErrorMessage('Service request must be at least 2 hours ahead of the current time.');
      return;
    }

    setStatus('finding');
    
    // Simulate finding a provider
    setTimeout(() => {
        setStatus('found');
    }, 2500);
  };

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
    "05:00 PM", "06:00 PM"
  ];

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="container mx-auto px-4 max-w-7xl py-10">
        
        {/* Breadcrumb / Header */}
        <div className="flex items-center justify-between mb-8">
           <div>
              <Link to={`/services/${category}`} className="text-gray-500 hover:text-[#1B3C53] text-sm mb-2 inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to {category}
              </Link>
              <h2 className="text-4xl font-bold text-[#1B3C53]">{item.title}</h2>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT COLUMN: Service Info */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                   <img src={item.image} alt={item.title} className="w-full h-96 object-cover" />
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    {/* <h3 className="text-2xl font-bold text-[#1B3C53] mb-4">Description</h3> */}
                    <p className="text-gray-700 leading-relaxed text-lg">{item.desc}</p>
                    
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        {/* <h3 className="text-xl font-bold text-[#1B3C53] mb-4">Pricing</h3> */}
                        <div className="flex items-center gap-4">
                             <span className="text-gray-600 text-lg">Starting Price:</span>
                             <span className="text-3xl font-bold text-[#1B3C53]">{formatPrice(item.basePrice)}</span>
                        </div>
                        <p className="text-gray-500 mt-2 text-sm bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                            Note: Extra 1% insurance charge will be added later.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Sticky Booking Form */}
            <div className="lg:col-span-1">
                <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className=" p-4 text-center">
                        <h3 className="text-[#1B3C53] font-bold text-xl">Request a Service</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                         {/* Address & Phone */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input 
                                    type="text" 
                                    placeholder="Full Address" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input 
                                    type="tel" 
                                    placeholder="Mobile Number" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition" 
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition cursor-pointer" 
                            />
                        </div>

                        {/* Time Slots */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => setTime(slot)}
                                        className={`py-2 px-1 rounded-lg text-sm font-medium transition border ${
                                            time === slot 
                                            ? 'bg-[#1B3C53] text-white border-[#1B3C53]' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B3C53] hover:text-[#1B3C53]'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2 text-center">Must be after 2 hours from now</p>
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100 flex items-start">
                                <svg className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            {status === 'finding' ? (
                                <div className="w-full py-4 bg-blue-50 text-[#1B3C53] rounded-xl flex items-center justify-center font-medium border border-blue-100">
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#1B3C53]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Finding Service Provider...
                                </div>
                            ) : status === 'found' ? (
                                <div className="w-full py-4 bg-green-50 text-green-700 rounded-xl flex flex-col items-center justify-center font-medium border border-green-100 text-center">
                                    <div className="flex items-center mb-1">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>Request Sent!</span>
                                    </div>
                                    <span className="text-xs">Service Provider will contact shortly.</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleRequestService} 
                                    className="w-full py-4 bg-[#1B3C53] text-white rounded-xl font-medium text-lg shadow-lg hover:bg-[#152e40] transition transform active:scale-95"
                                >
                                    Request Service
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ServiceDetails;

