import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SubCatHeader from '../components/SubCatHeader';
import Footer from '../components/Footer';
import plumbingImg from '../assets/images/services/plumbing.png';
import electricalImg from '../assets/images/services/electrical.png';
import cleaningImg from '../assets/images/services/cleaning.png';
import gardeningImg from '../assets/images/services/gardening.png';
import paintingImg from '../assets/images/services/painting.png';

const DATA = {
  plumbing: [
    { slug: 'tap-repair', title: 'Tap Repair', desc: 'Fix leaking or faulty taps.', basePrice: 500, image: plumbingImg },
    { slug: 'bathtub-repair', title: 'Bathtub Repair', desc: 'Repair cracks and fittings.', basePrice: 1500, image: plumbingImg },
    { slug: 'pipe-leakage-repair', title: 'Water Pipe Leakage Repair', desc: 'Identify and fix pipe leaks.', basePrice: 1200, image: plumbingImg },
    { slug: 'drain-unclogging', title: 'Drain Unclogging', desc: 'Clear clogged kitchen/bath drains.', basePrice: 800, image: plumbingImg },
  ],
  electrical: [
    { slug: 'wiring-fix', title: 'Wiring Fix', desc: 'Diagnose and repair wiring issues.', basePrice: 1000, image: electricalImg },
    { slug: 'socket-install', title: 'Socket Install', desc: 'Install new power sockets.', basePrice: 700, image: electricalImg },
    { slug: 'lighting-setup', title: 'Lighting Setup', desc: 'Install indoor/outdoor lighting.', basePrice: 900, image: electricalImg },
  ],
  cleaning: [
    { slug: 'deep-clean', title: 'Deep Clean', desc: 'Comprehensive whole-home clean.', basePrice: 2000, image: cleaningImg },
    { slug: 'kitchen-clean', title: 'Kitchen Clean', desc: 'Degrease and sanitize kitchen.', basePrice: 1200, image: cleaningImg },
  ],
  gardening: [
    { slug: 'lawn-care', title: 'Lawn Care', desc: 'Mow and edge lawn areas.', basePrice: 600, image: gardeningImg },
    { slug: 'hedge-trim', title: 'Hedge Trim', desc: 'Trim hedges and shrubs.', basePrice: 700, image: gardeningImg },
  ],
  painting: [
    { slug: 'interior-room', title: 'Interior Room', desc: 'Paint a single room.', basePrice: 2500, image: paintingImg },
    { slug: 'exterior-wall', title: 'Exterior Wall', desc: 'Paint exterior walls.', basePrice: 4000, image: paintingImg },
  ],
};

const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

const SubServices = () => {
  const { category } = useParams();
  const list = DATA[category] || [];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F9F5F0] to-[#ece7df]">
      <SubCatHeader/>

      {/* Hero Section */}
      {list.length > 0 && (
        <div
          className="relative h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${list[0].image})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 container mx-auto max-w-7xl h-full flex items-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
              {category} Services
            </h1>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#1B3C53] capitalize">
            Available Services
          </h2>
          <Link to="/services" className="text-[#1B3C53] hover:text-[#1a3248]">
            Back to Services
          </Link>
        </div>

        <p className="text-gray-600 mb-10">
          Pick the {category} service you need — all with transparent pricing.
        </p>

        {list.length === 0 ? (
          <p className="text-gray-600">No sub-services found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {list.map((item) => {
              const insurance = Math.round(item.basePrice * 0.01);
              const total = item.basePrice + insurance;

              return (
                <Link
                  key={item.slug}
                  to={`/services/${category}/${item.slug}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden block"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-6 space-y-3">
                    <span className="inline-block px-3 py-1 text-xs bg-[#1B3C53]/10 text-[#1B3C53] rounded-full capitalize">
                      {category}
                    </span>

                    <h3 className="text-xl font-semibold text-[#1B3C53]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600">{item.desc}</p>

                    <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Service charge</span>
                        <span>{formatPrice(item.basePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance (1%)</span>
                        <span>{formatPrice(insurance)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default SubServices;
