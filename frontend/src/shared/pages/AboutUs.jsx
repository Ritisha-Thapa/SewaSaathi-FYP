import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ShieldCheck, Clock, CheckCircle, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import aboutHero from '../../assets/images/testimonials/image1.png';
import member1 from '../../assets/images/testimonials/image1.png';
import member2 from '../../assets/images/testimonials/image2.png';
import member3 from '../../assets/images/testimonials/image3.jpg';
import member4 from '../../assets/images/testimonials/image2.png';

const AboutUs = () => {
  const { t } = useTranslation();
  const teamMembers = [
    { name: 'Sita Karki', role: t('about.team_role_ceo', 'CEO & Founder'), imageUrl: member1 },
    { name: 'Rita Thapa', role: t('about.team_role_cto', 'CTO'), imageUrl: member2 },
    { name: 'Ram Khatri', role: t('about.team_role_ops', 'Head of Operations'), imageUrl: member3 },
    { name: 'Gita Basnet', role: t('about.team_role_cs', 'Customer Success'), imageUrl: member4 }
  ];

  const differentiators = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-[#1B3C53]" />,
      title: t('about.diff_verified_title', 'Verified Providers'),
      description: t('about.diff_verified_desc', 'All service providers undergo thorough background checks and verification processes.')
    },
    {
      icon: <Clock className="w-12 h-12 text-[#1B3C53]" />,
      title: t('about.diff_support_title', '24/7 Support'),
      description: t('about.diff_support_desc', 'Round-the-clock customer support to assist you whenever you need help.')
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-[#1B3C53]" />,
      title: t('about.diff_quality_title', 'Quality Guaranteed'),
      description: t('about.diff_quality_desc', 'We ensure high-quality services with satisfaction guarantees and easy refunds.')
    },
    {
      icon: <Banknote className="w-12 h-12 text-[#1B3C53]" />,
      title: t('about.diff_pricing_title', 'Transparent Pricing'),
      description: t('about.diff_pricing_desc', 'No hidden fees. Clear, upfront pricing for all services with multiple payment options.')
    }
  ];

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-[#F9F5F0] py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-12">

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B3C53] mb-6 leading-tight">
                {t('about.hero_title', 'About SewaSaathi')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                {t('about.hero_subtitle', 'Connecting communities with trusted service providers across Nepal.')}
              </p>
              {/* CTA BUTTONS REMOVED */}
            </div>

            <div className="flex-1 flex justify-center items-center">
              <img
                src={aboutHero}
                alt={t('about.hero_alt', 'About Us')}
                className="w-[500px] h-[500px] object-cover rounded-2xl shadow-lg border border-gray-200
                transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] mb-6">{t('about.who_title', 'Who We Are')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {t('about.who_desc', 'We make it effortless to find and book trusted local service providers. Our platform brings transparency, reliability, and speed to everyday services.')}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#1B3C53] mb-2">{t('about.pillar_connect_title', 'Connect')}</h3>
              <p className="text-gray-600">{t('about.pillar_connect_desc', 'Match with verified professionals for your needs in minutes.')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#1B3C53] mb-2">{t('about.pillar_book_title', 'Book')}</h3>
              <p className="text-gray-600">{t('about.pillar_book_desc', 'Easy scheduling with clear pricing and flexible payment options.')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-[#1B3C53] mb-2">{t('about.pillar_relax_title', 'Relax')}</h3>
              <p className="text-gray-600">{t('about.pillar_relax_desc', 'Reliable service delivery backed by support when you need it.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
            {t('about.why_title', 'Why Choose SewaSaathi?')}
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
              <div className="text-gray-600">{t('about.stats_customers', 'Happy Customers')}</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-[#1B3C53]">1k+</div>
              <div className="text-gray-600">{t('about.stats_providers', 'Verified Providers')}</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-[#1B3C53]">10k+</div>
              <div className="text-gray-600">{t('about.stats_services', 'Completed Services')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
            {t('about.team_title', 'Our Team')}
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
