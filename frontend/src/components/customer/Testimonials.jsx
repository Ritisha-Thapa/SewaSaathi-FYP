import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { api } from '../../utils/api';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const data = await api.get('/booking/reviews/top_reviews/');
        setReviews(data || []);
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopReviews();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16 md:py-20 animate-pulse">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-10 w-64 bg-gray-200 mx-auto mb-12 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 h-64 rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#F9F5F0] rounded-xl p-6 hover:shadow-xl transition shadow-lg flex flex-col h-full"
            >
              {/* Profile Picture and Name/Title Section */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#1B3C53] flex items-center justify-center text-white">
                  {review.customer_profile_image ? (
                    <img
                      src={review.customer_profile_image}
                      alt={review.customer_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#1B3C53] mb-1">{review.customer_name}</h3>
                  <p className="text-sm text-gray-600">Used {review.service_name} Service</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 text-left leading-relaxed flex-1">
                "{review.comment}"
              </p>

              {/* Star Rating and Date Section */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
