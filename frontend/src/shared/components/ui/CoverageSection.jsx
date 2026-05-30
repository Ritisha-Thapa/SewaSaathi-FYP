import React from 'react';
import { Building2, MapPin, Home } from 'lucide-react';

const cities = [
  {
    name: 'Kathmandu',
    district: 'Capital district',
    icon: Building2,
  },
  {
    name: 'Lalitpur',
    district: 'Patan district',
    icon: MapPin,
  },
  {
    name: 'Bhaktapur',
    district: 'Heritage district',
    icon: Home,
  },
];

const ValleyMap = () => (
  <svg
    viewBox="0 0 420 320"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    aria-hidden="true"
  >
    {/* Valley blob background */}
    <path
      d="M60 180 C40 120 80 50 150 40 C200 32 260 28 310 55 C360 80 390 130 380 190 C370 250 330 285 270 295 C210 305 160 300 120 270 C80 242 78 238 60 180 Z"
      fill="rgba(249,245,240,0.07)"
      stroke="rgba(249,245,240,0.18)"
      strokeWidth="1.5"
    />

    {/* Inner terrain lines */}
    <path
      d="M120 170 C140 150 180 140 220 145 C260 150 300 160 330 180"
      fill="none"
      stroke="rgba(249,245,240,0.1)"
      strokeWidth="1"
    />
    <path
      d="M100 200 C130 185 175 178 220 180 C265 182 305 192 340 208"
      fill="none"
      stroke="rgba(249,245,240,0.08)"
      strokeWidth="1"
    />

    {/* Dashed connector lines between cities */}
    {/* Kathmandu (220,130) → Lalitpur (175,195) */}
    <line
      x1="220" y1="130"
      x2="175" y2="195"
      stroke="rgba(249,245,240,0.3)"
      strokeWidth="1"
      strokeDasharray="5 4"
    />
    {/* Lalitpur (175,195) → Bhaktapur (295,175) */}
    <line
      x1="175" y1="195"
      x2="295" y2="175"
      stroke="rgba(249,245,240,0.3)"
      strokeWidth="1"
      strokeDasharray="5 4"
    />
    {/* Kathmandu (220,130) → Bhaktapur (295,175) */}
    <line
      x1="220" y1="130"
      x2="295" y2="175"
      stroke="rgba(249,245,240,0.2)"
      strokeWidth="1"
      strokeDasharray="5 4"
    />

    {/* City pin — Kathmandu */}
    <circle cx="220" cy="130" r="16" fill="rgba(249,245,240,0.1)" />
    <circle cx="220" cy="130" r="9" fill="rgba(249,245,240,0.2)" />
    <circle cx="220" cy="130" r="5" fill="#F9F5F0" />
    <text
      x="220" y="112"
      textAnchor="middle"
      fill="rgba(249,245,240,0.9)"
      fontSize="11"
      fontWeight="600"
      fontFamily="Inter, system-ui, sans-serif"
    >
      Kathmandu
    </text>

    {/* City pin — Lalitpur */}
    <circle cx="175" cy="195" r="16" fill="rgba(249,245,240,0.1)" />
    <circle cx="175" cy="195" r="9" fill="rgba(249,245,240,0.2)" />
    <circle cx="175" cy="195" r="5" fill="#F9F5F0" />
    <text
      x="175" y="222"
      textAnchor="middle"
      fill="rgba(249,245,240,0.9)"
      fontSize="11"
      fontWeight="600"
      fontFamily="Inter, system-ui, sans-serif"
    >
      Lalitpur
    </text>

    {/* City pin — Bhaktapur */}
    <circle cx="295" cy="175" r="16" fill="rgba(249,245,240,0.1)" />
    <circle cx="295" cy="175" r="9" fill="rgba(249,245,240,0.2)" />
    <circle cx="295" cy="175" r="5" fill="#F9F5F0" />
    <text
      x="295" y="157"
      textAnchor="middle"
      fill="rgba(249,245,240,0.9)"
      fontSize="11"
      fontWeight="600"
      fontFamily="Inter, system-ui, sans-serif"
    >
      Bhaktapur
    </text>
  </svg>
);

const CoverageSection = () => {
  return (
    <section className="bg-primary section-padding">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left — text content */}
          <div className="w-full md:w-[55%]">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(249,245,240,0.55)' }}
            >
              Coverage Area
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold mb-3 leading-tight"
              style={{ color: '#F9F5F0' }}
            >
              Now serving the Kathmandu Valley
            </h2>
            <p
              className="text-sm md:text-base mb-8 max-w-prose"
              style={{ color: 'rgba(249,245,240,0.65)' }}
            >
              Book trusted home services across 3 districts — fast, verified, and insured.
            </p>

            {/* City list */}
            <div className="flex flex-col">
              {cities.map((city, index) => {
                const Icon = city.icon;
                const isLast = index === cities.length - 1;
                return (
                  <div
                    key={city.name}
                    className="flex items-center gap-4 py-[10px]"
                    style={{
                      borderBottom: isLast
                        ? 'none'
                        : '0.5px solid rgba(249,245,240,0.15)',
                    }}
                  >
                    {/* Icon box */}
                    <div
                      className="shrink-0 flex items-center justify-center rounded-lg"
                      style={{
                        width: 32,
                        height: 32,
                        background: 'rgba(249,245,240,0.12)',
                      }}
                    >
                      <Icon size={15} color="#F9F5F0" />
                    </div>

                    {/* City info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-bold leading-tight"
                        style={{ color: '#F9F5F0' }}
                      >
                        {city.name}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'rgba(249,245,240,0.5)' }}
                      >
                        {city.district}
                      </p>
                    </div>

                    {/* Active badge */}
                    <span
                      className="shrink-0 font-semibold"
                      style={{
                        background: 'rgba(249,245,240,0.15)',
                        color: '#F9F5F0',
                        fontSize: 11,
                        padding: '3px 10px',
                        borderRadius: 999,
                      }}
                    >
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — SVG map */}
          <div
            className="hidden sm:flex w-full md:w-[45%] items-center justify-center"
            style={{ minHeight: 220 }}
          >
            <div className="w-full max-w-sm aspect-[4/3]">
              <ValleyMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
