import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Browse & Choose',
      description: 'Find the service you need',
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: '2',
      title: 'Book & Pay',
      description: 'Schedule and pay via eSewa or COD',
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '3',
      title: 'Relax & Review',
      description: 'Get service done and give feedback',
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 max-w-sm">
              <div className="bg-[#F9F5F0] rounded-2xl p-8 text-center hover:shadow-xl transition shadow-lg">
                <div className="flex justify-center mb-6">
                  <div className="bg-white rounded-full p-4">
                    {step.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-[#1B3C53] mb-4">{step.number}️⃣</div>
                <h3 className="text-xl font-bold text-[#1B3C53] mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

