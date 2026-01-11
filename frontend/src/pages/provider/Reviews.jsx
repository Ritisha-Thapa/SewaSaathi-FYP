import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { providerReviews, providerStats } from '../../data/providerMockData';

const Reviews = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">Client Reviews</h2>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-8">
         <div className="text-center">
            <h3 className="text-5xl font-bold text-[#1B3C53]">{providerStats.averageRating}</h3>
            <div className="flex justify-center text-yellow-500 my-2">
               {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" /> )}
            </div>
            <p className="text-sm text-gray-500">Overall Rating</p>
         </div>
         <div className="h-24 w-px bg-gray-200"></div>
         <div>
            <p className="text-gray-600">Based on <span className="font-bold text-[#1B3C53]">{providerStats.completedJobs}</span> completed jobs.</p>
            <p className="text-sm text-gray-500 mt-1">Consistency is key to getting more job requests.</p>
         </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
         {providerReviews.map((review) => (
             <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h4 className="font-bold text-[#1B3C53]">{review.customerName}</h4>
                      <p className="text-xs text-gray-500">{review.service} • {review.date}</p>
                   </div>
                   <div className="flex bg-yellow-50 px-2 py-1 rounded-lg">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-500" fill="currentColor" />)}
                   </div>
                </div>
                <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg flex gap-2">
                   <MessageSquare size={16} className="text-gray-400 mt-0.5 shrink-0" />
                   "{review.comment}"
                </p>
             </div>
         ))}
      </div>
    </div>
  );
};

export default Reviews;
