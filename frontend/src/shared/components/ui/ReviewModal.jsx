import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { api } from '../../../utils/api';
import Button from './Button';

const ReviewModal = ({ isOpen, onClose, booking, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        booking: booking.id,
        provider: booking.provider,
        rating: rating,
        comment: comment
      };
      await api.post('/booking/reviews/', payload);
      onReviewSubmit();
      onClose();
    } catch (err) {
      console.error("Failed to submit review", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1B3C53] mb-2">How was your service?</h2>
            <p className="text-gray-500 text-sm">Your feedback helps {booking.provider_name} and our community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition transform active:scale-90"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={40}
                    className={`transition-colors duration-200 ${star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                      }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1B3C53] mb-2 uppercase">Your Experience (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share more details about the service..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition h-32 resize-none text-sm placeholder-gray-400 bg-gray-50"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={rating === 0}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit Review
            </Button>
            <p className="text-[10px] text-center text-gray-400 font-medium">Nothing is compulsory. Feedbacks are optional.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
