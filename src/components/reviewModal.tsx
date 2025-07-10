'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}>) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Write a Review</h2>

        <div className="mb-4">
          <label htmlFor="rating" className="block mb-2 text-sm">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'fill-yellow-400 stroke-yellow-400'
                    : 'stroke-gray-400'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="review-comment" className="block mb-2 text-sm">Comment</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="border px-3 py-2 rounded w-full"
            placeholder="Share your experience..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(rating, comment)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
