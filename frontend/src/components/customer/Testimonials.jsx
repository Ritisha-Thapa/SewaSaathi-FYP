import React from 'react';

import img1 from "../../assets/images/testimonials/image1.png";
import img2 from "../../assets/images/testimonials/image2.png";
import img3 from "../../assets/images/testimonials/image3.jpg";


const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Maharjan',
      title: 'Used Plumbing Service',
      quote:
        'SewaSaathi helped me find an excellent plumber quickly. The service was professional and affordable. Highly recommended!',
      imageUrl: img1,
      initials: 'PM',
      color: 'blue',
      date: '01/15/2024',
      rating: 5,
    },
    {
      name: 'Rita Khatri',
      title: 'Used Electrical Service',
      quote:
        'Great platform! The electrician was verified and did an amazing job. The payment process was smooth too.',
      imageUrl: img2,
      initials: 'RK',
      color: 'yellow',
      date: '02/20/2024',
      rating: 5,
    },
    {
      name: 'Anish Gurung',
      title: 'Used Cleaning Service',
      quote:
        'I booked a cleaner through SewaSaathi and was impressed by the quality of service. Will definitely use again!',
      imageUrl: img3,
      initials: 'AG',
      color: 'green',
      date: '03/10/2024',
      rating: 5,
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#F9F5F0] rounded-xl p-6 hover:shadow-xl transition shadow-lg"
            >
              {/* Profile Picture and Name/Title Section */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1B3C53] mb-1">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 text-left leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Star Rating and Date Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Reviewed on {testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
