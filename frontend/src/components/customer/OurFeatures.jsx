import React from 'react';
import { ShieldCheck, Lock, Mic } from 'lucide-react';

const OurFeatures = () => {
  const features = [
    {
      title: 'Verified Providers',
      description: 'All service providers are background checked and verified',
      icon: <ShieldCheck className="w-8 h-8 text-[#1B3C53]" />
    },
    {
      title: 'Secure Payments',
      description: 'Pay safely via eSewa or Cash on Delivery',
      icon: <Lock className="w-8 h-8 text-[#1B3C53]" />
    },
    {
      title: '1% Insurance Fund',
      description: 'Protected by our insurance fund for your peace of mind',
      icon: <ShieldCheck className="w-8 h-8 text-[#1B3C53]" />
    },
    {
      title: 'Voice Guidance',
      description: 'Get help in Nepali with our voice guidance feature',
      icon: <Mic className="w-8 h-8 text-[#1B3C53]" />
    }
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#F9F5F0] rounded-2xl p-6 text-center hover:shadow-xl transition shadow-lg"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#1B3C53] mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFeatures;
