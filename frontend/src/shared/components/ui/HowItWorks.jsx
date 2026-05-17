import React from 'react';
import { Search, CheckCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    {
      title: t('landing.how_it_works_step1_title', 'Browse & Choose'),
      description: t('landing.how_it_works_step1_desc', 'Find the service you need'),
      icon: <Search className="w-12 h-12 text-[#1B3C53]" />
    },
    {
      title: t('landing.how_it_works_step2_title', 'Book & Pay'),
      description: t('landing.how_it_works_step2_desc', 'Schedule and pay via eSewa or COD'),
      icon: <CheckCircle className="w-12 h-12 text-[#1B3C53]" />
    },
    {
      title: t('landing.how_it_works_step3_title', 'Relax & Review'),
      description: t('landing.how_it_works_step3_desc', 'Get service done and give feedback'),
      icon: <Star className="w-12 h-12 text-[#1B3C53]" />
    }
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          {t('landing.how_it_works_title', 'How It Works')}
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
