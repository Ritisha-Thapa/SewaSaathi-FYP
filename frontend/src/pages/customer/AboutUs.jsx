import React from 'react';
import DashboardHeader from '../../components/customer/DashboardHeader';
import Footer from '../../components/customer/Footer';
import { Link } from 'react-router-dom';
import aboutHero from '../../assets/images/testimonials/image1.png';
import member1 from '../../assets/images/testimonials/image1.png';
import member2 from '../../assets/images/testimonials/image2.png';
import member3 from '../../assets/images/testimonials/image3.jpg';
import member4 from '../../assets/images/testimonials/image2.png';    

const AboutUs = () => {
  const teamMembers = [
    { name: 'Sita Karki', role: 'CEO & Founder', imageUrl: member1 },
    { name: ' Rita Thapa', role: 'CTO', imageUrl: member2 },
    { name: 'Ram Khatri', role: 'Head of Operations', imageUrl: member3 },
    { name: 'Gita Basnet', role: 'Customer Success', imageUrl: member4 }
  ];

  const differentiators = [
    {
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verified Providers',
      description: 'All service providers undergo thorough background checks and verification processes.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you whenever you need help.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Quality Guaranteed',
      description: 'We ensure high-quality services with satisfaction guarantees and easy refunds.'
    },
    {
      icon: (
        <svg className="w-12 h-12 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Transparent Pricing',
      description: 'No hidden fees. Clear, upfront pricing for all services with multiple payment options.'
    }
  ];

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <DashboardHeader />

      {/* HERO SECTION */}
      <section className="bg-[#F9F5F0] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B3C53] mb-6 leading-tight">
                About SewaSaathi
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Connecting communities with trusted service providers across Nepal.
              </p>
              {/* CTA BUTTONS REMOVED */}
            </div>

            <div className="flex-1 flex justify-center items-center">
              <img
                src={aboutHero}
                alt="About Us"
                className="w-[500px] h-[500px] object-cover rounded-2xl shadow-lg border border-gray-200
                transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] mb-6">Who We Are</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We make it effortless to find and book trusted local service providers.
            Our platform brings transparency, reliability, and speed to everyday services.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#1B3C53] mb-2">Connect</h3>
              <p className="text-gray-600">Match with verified professionals for your needs in minutes.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#1B3C53] mb-2">Book</h3>
              <p className="text-gray-600">Easy scheduling with clear pricing and flexible payment options.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#1B3C53] mb-2">Relax</h3>
              <p className="text-gray-600">Reliable service delivery backed by support when you need it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
            Why Choose SewaSaathi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition shadow-lg"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#1B3C53] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-[#1B3C53]">50k+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-[#1B3C53]">1k+</div>
              <div className="text-gray-600">Verified Providers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-[#1B3C53]">10k+</div>
              <div className="text-gray-600">Completed Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
            Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition shadow-lg">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-[#F0F4F8] flex items-center justify-center">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const next = e.target.nextElementSibling;
                      if (next) next.style.display = 'flex';
                    }}
                  />
                  <div className="font-bold text-[#1B3C53]" style={{ display: 'none' }}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#1B3C53] mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
