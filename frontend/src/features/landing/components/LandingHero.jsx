import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Zap, Sparkles, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const LandingHero = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              {t('landing.hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              {t('landing.hero_subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/signup/customer">
                <Button className="px-10 py-4 shadow-xl">
                  {t('landing.book_service')}
                </Button>
              </Link>
              <Link to="/signup/provider">
                <Button variant="outline" className="px-10 py-4">
                  {t('landing.become_provider')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center items-center">
            <div className="grid grid-cols-2 gap-6 max-w-md">
              {/* Plumber */}
              <div className="bg-background rounded-2xl p-6 shadow-lg shadow-primary/5 text-center transition-all hover:scale-105 border border-white/50">
                <div className="w-20 h-20 bg-plumber-bg rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <Wrench className="w-10 h-10 text-plumber" />
                </div>
                <h3 className="font-bold text-gray-800">{t('landing.plumber')}</h3>
              </div>

              {/* Electrician */}
              <div className="bg-background rounded-2xl p-6 shadow-lg shadow-primary/5 text-center transition-all hover:scale-105 border border-white/50">
                <div className="w-20 h-20 bg-electrician-bg rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <Zap className="w-10 h-10 text-electrician" />
                </div>
                <h3 className="font-bold text-gray-800">{t('landing.electrician')}</h3>
              </div>

              {/* Cleaner */}
              <div className="bg-background rounded-2xl p-6 shadow-lg shadow-primary/5 text-center transition-all hover:scale-105 border border-white/50">
                <div className="w-20 h-20 bg-cleaner-bg rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <Sparkles className="w-10 h-10 text-cleaner" />
                </div>
                <h3 className="font-bold text-gray-800">{t('landing.cleaner')}</h3>
              </div>

              {/* Gardener */}
              <div className="bg-background rounded-2xl p-6 shadow-lg shadow-primary/5 text-center transition-all hover:scale-105 border border-white/50">
                <div className="w-20 h-20 bg-gardener-bg rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  <Leaf className="w-10 h-10 text-gardener" />
                </div>
                <h3 className="font-bold text-gray-800">{t('landing.gardener')}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;

