import React, { useState } from 'react';
import type { ReviewItem } from '../../types';
import { StorageEngine } from '../../services/storage';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Star, Send } from 'lucide-react';

interface ReviewSectionProps {
  propertyId: string;
  sellerId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ propertyId, sellerId }) => {
  const { currentUser } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [reviews, setReviews] = useState<ReviewItem[]>(() =>
    StorageEngine.getReviewsForProperty(propertyId)
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev = StorageEngine.addReview({
      propertyId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
    });

    setReviews([newRev, ...reviews]);
    setComment('');
    addNotification('success', 'Review Posted!', 'Thank you for submitting your verified feedback.');
  };

  const handleSellerReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;

    const all = StorageEngine.getReviewsForProperty(propertyId);
    const rev = all.find((r) => r.id === reviewId);
    if (rev) {
      rev.sellerReply = text;
      localStorage.setItem('estatemarket_reviews', JSON.stringify(all));
      setReviews(StorageEngine.getReviewsForProperty(propertyId));
      addNotification('success', 'Reply Added', 'Your seller response has been attached.');
    }
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Property Reviews & Buyer Ratings
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Verified tours and buyer feedback</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
          <span className="text-2xl font-extrabold text-white">{avgRating}</span>
          <div>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-slate-400">{reviews.length} total reviews</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddReview} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h5 className="text-xs font-bold text-slate-200">Write a Review</h5>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 mr-2">Your Rating:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`w-4 h-4 ${
                  star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        <textarea
          rows={2}
          placeholder="Share your experience regarding location, property condition, neighborhood, or seller communication..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:outline-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Review
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No reviews yet for this listing. Be the first to share feedback!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={rev.userName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">{rev.userName}</span>
                    <span className="block text-[10px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-9">{rev.comment}</p>

              {rev.sellerReply ? (
                <div className="ml-9 mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300">
                  <span className="font-bold block text-slate-200 mb-0.5">Seller Response:</span>
                  <p className="text-slate-300">{rev.sellerReply}</p>
                </div>
              ) : currentUser.id === sellerId && (
                <div className="ml-9 mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Reply as seller..."
                    value={replyText[rev.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                    className="flex-1 bg-slate-900 text-xs text-white px-3 py-1.5 rounded-lg border border-slate-800"
                  />
                  <button
                    onClick={() => handleSellerReply(rev.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
