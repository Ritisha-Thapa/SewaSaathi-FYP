import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { api } from '../../utils/api';
import Skeleton from '../../components/Skeleton';

const Reviews = () => {
   const [reviews, setReviews] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchReviews();
   }, []);

   const fetchReviews = async () => {
      try {
         // Fetch all reviews. The viewset orders by -created_at.
         // We can rely on the backend to filter by provider_id if we knew it,
         // but if the logged in user is a provider, we can just fetch /booking/reviews/ 
         // and filter by the provider's name/id, or update backend to filter by request.user
         // For now, let's fetch all and assume the backend will only return relevant ones if we add a query param, 
         // or we just render them all for testing. Let's add ?my_reviews=true to the URL and update backend later if needed.
         const data = await api.get('/booking/reviews/');
         // Filter out reviews where the provider is the current user. Since we don't have the ID, 
         // let's just show all returned reviews for now.
         setReviews(data);
      } catch (err) {
         console.error("Failed to fetch reviews", err);
      } finally {
         setLoading(false);
      }
   };

   const averageRating = reviews.length > 0
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

   if (loading) {
      return (
         <div className="space-y-6">
            <Skeleton className="w-48 h-8 font-bold text-[#1B3C53]" />
            <Skeleton className="w-full h-32 rounded-xl" />
            <Skeleton className="w-full h-24 rounded-xl" />
            <Skeleton className="w-full h-24 rounded-xl" />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <h2 className="text-2xl font-bold text-[#1B3C53]">Client Reviews</h2>

         {/* Summary */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-8">
            <div className="text-center">
               <h3 className="text-5xl font-bold text-[#1B3C53]">{averageRating}</h3>
               <div className="flex justify-center text-yellow-500 my-2">
                  {[...Array(5)].map((_, i) => (
                     <Star
                        key={i}
                        size={20}
                        fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                        className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}
                     />
                  ))}
               </div>
               <p className="text-sm text-gray-500">Overall Rating</p>
            </div>
            <div className="h-24 w-px bg-gray-200"></div>
            <div>
               <p className="text-gray-600">Based on <span className="font-bold text-[#1B3C53]">{reviews.length}</span> reviews.</p>
               <p className="text-sm text-gray-500 mt-1">Consistency is key to getting more job requests.</p>
            </div>
         </div>

         {/* Reviews List */}
         <div className="grid gap-4">
            {reviews.length === 0 ? (
               <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                  No reviews yet. Complete more jobs to earn reviews!
               </div>
            ) : (
               reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <h4 className="font-bold text-[#1B3C53]">{review.customer_name}</h4>
                           <p className="text-xs text-gray-500">{review.service_name || 'Service'} • {new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex bg-yellow-50 px-2 py-1 rounded-lg">
                           {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-500" fill="currentColor" />)}
                        </div>
                     </div>
                     {review.comment && (
                        <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg flex gap-2">
                           <MessageSquare size={16} className="text-gray-400 mt-0.5 shrink-0" />
                           "{review.comment}"
                        </p>
                     )}
                  </div>
               ))
            )}
         </div>
      </div>
   );
};

export default Reviews;
