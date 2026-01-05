// import React from 'react';
// import plumbing from "../assets/images/services/plumbing.png";
// import cleaning from "../assets/images/services/cleaning.png";
// import electrical from "../assets/images/services/electrical.png";
// import gardening from "../assets/images/services/gardening.png";
// import painting from "../assets/images/services/painting.png";

// const FeaturedServices = () => {
//   const services = [
//     {
//       name: 'Plumbing',
//       imageUrl: plumbing,
//       icon: (
//         <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M14 7h2a3 3 0 0 1 0 6h-1m-6 0H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m8 0V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2m8 0h-2" />
//         </svg>
//       ),
//       color: 'bg-blue-100'
//     },
//     {
//       name: 'Cleaning',
//       imageUrl: cleaning,
//       icon: (
//         <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
//           <path d="M6.34 6.34l2.83 2.83m7.66 7.66l2.83 2.83M17.66 6.34l-2.83 2.83M6.34 17.66l-2.83-2.83" />
//         </svg>
//       ),
//       color: 'bg-green-100'
//     },
//     {
//       name: 'Electrical',
//       imageUrl: electrical,
//       icon: (
//         <svg className="w-16 h-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//         </svg>
//       ),
//       color: 'bg-yellow-100'
//     },
//     {
//       name: 'Gardening',
//       imageUrl: gardening,
//       icon: (
//         <svg className="w-16 h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
//           <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
//         </svg>
//       ),
//       color: 'bg-emerald-100'
//     },
//     {
//       name: 'Painting',
//       imageUrl: painting,
//       icon: (
//         <svg className="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M9.06 2.06l-5 5a1.5 1.5 0 0 0 0 2.12l8.84 8.84a1.5 1.5 0 0 0 2.12 0l5-5a1.5 1.5 0 0 0 0-2.12L11.18 2.06a1.5 1.5 0 0 0-2.12 0z" />
//         </svg>
//       ),
//       color: 'bg-purple-100'
//     }
//   ];

//   return (
//     <section id="services" className="bg-white py-16 md:py-20">
//       <div className="container mx-auto px-4 max-w-7xl">
//         <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
//           Featured Services
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
//           {services.map((service, index) => (
//             <div key={index} className="card text-center">
//               <div className={`${service.color} rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden`}>
//                 {service.imageUrl ? (
//                   <img 
//                     src={service.imageUrl} 
//                     alt={service.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 ) : null}

//                 <div style={{ display: service.imageUrl ? 'none' : 'flex' }} className="w-full h-full items-center justify-center">
//                   {service.icon}
//                 </div>
//               </div>

//               <h3 className="text-xl font-bold text-[#1B3C53]">{service.name}</h3>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedServices;

import React from 'react';
import plumbing from "../../assets/images/services/plumbing.png";
import cleaning from "../../assets/images/services/cleaning.png";
import electrical from "../../assets/images/services/electrical.png";
import gardening from "../../assets/images/services/gardening.png";
import painting from "../../assets/images/services/painting.png";

const FeaturedServices = () => {
  const services = [
    {
      name: 'Plumbing',
      imageUrl: plumbing,
      icon: (
        <svg className="w-16 h-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 7h2a3 3 0 0 1 0 6h-1m-6 0H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m8 0V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2m8 0h-2" />
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      name: 'Cleaning',
      imageUrl: cleaning,
      icon: (
        <svg className="w-16 h-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          <path d="M6.34 6.34l2.83 2.83m7.66 7.66l2.83 2.83M17.66 6.34l-2.83 2.83M6.34 17.66l-2.83-2.83" />
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      name: 'Electrical',
      imageUrl: electrical,
      icon: (
        <svg className="w-16 h-16 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      color: 'bg-yellow-100'
    },
    {
      name: 'Gardening',
      imageUrl: gardening,
      icon: (
        <svg className="w-16 h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
      color: 'bg-emerald-100'
    },
    {
      name: 'Painting',
      imageUrl: painting,
      icon: (
        <svg className="w-16 h-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.06 2.06l-5 5a1.5 1.5 0 0 0 0 2.12l8.84 8.84a1.5 1.5 0 0 0 2.12 0l5-5a1.5 1.5 0 0 0 0-2.12L11.18 2.06a1.5 1.5 0 0 0-2.12 0z" />
        </svg>
      ),
      color: 'bg-purple-100'
    }
  ];

  return (
    <section id="services" className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          Featured Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-[#F9F5F0] rounded-xl p-6 text-center hover:shadow-xl transition hover:scale-105 shadow-lg">
              <div className={`${service.color} rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden`}>
                {service.imageUrl ? (
                  <img 
                    src={service.imageUrl} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}

                <div style={{ display: service.imageUrl ? 'none' : 'flex' }} className="w-full h-full items-center justify-center">
                  {service.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1B3C53]">{service.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
