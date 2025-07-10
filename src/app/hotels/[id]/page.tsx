"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { getHotelViewInfoQuery, leaveReviewMutation } from "@/utils/queries";
import { Star } from "lucide-react";
import HotelImagesCarousel from "@/components/hotelImageCarousel";
import ReviewModal from "@/components/reviewModal";
import { HotelWithRooms } from "@/types/hotel";

export default function HotelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const searchParams = useSearchParams();

  const startDate = searchParams?.get("startDate") || "";
  const endDate = searchParams?.get("endDate") || "";
  const guests = Number(searchParams?.get("guests") || 1);

  const [hotel, setHotel] = useState<HotelWithRooms | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axiosClient.post("", {
          query: getHotelViewInfoQuery,
          variables: { id },
        });
        setHotel(res.data.data.hotel);
      } catch (err) {
        alert("Failed to fetch hotel: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleSubmitReview = async (rating: number, comment: string) => {
    try {
      const res = await axiosClient.post("", {
        query: leaveReviewMutation,
        variables: {
          input: {
            hotelId: hotel?.id,
            rating,
            comment,
          },
        },
      });

      if (res.data.errors) {
        alert(
          "Failed to submit review: " +
            res.data.errors.map((e: any) => e.message).join(", ")
        );
        return;
      }

      setShowReviewModal(false);
      // Refresh hotel reviews
      const refreshed = await axiosClient.post("", {
        query: getHotelViewInfoQuery,
        variables: { id },
      });
      setHotel(refreshed.data.data.hotel);
    } catch (err) {
      alert("Failed to submit review: " + err);
    }
  };

  const handleRoomBooking = (roomType: string) => {
    if (!startDate || !endDate || !guests) {
      alert("Please select check-in date, check-out date, and number of guests while searching.");
      return;
    }

    router.push(
      `/book?hotelId=${hotel?.id}&startDate=${startDate}&endDate=${endDate}&guests=${guests}&roomType=${roomType}`
    );
  };

  if (loading) return <div className="p-10 text-center">Loading hotel...</div>;
  if (!hotel)
    return (
      <div className="p-10 text-center text-red-600">Hotel not found.</div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <HotelImagesCarousel images={hotel.images} />

      {/* Hotel Info */}
      <div>
        <div className="mb-3">
          <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
          <p className="text-sm text-gray-600">📍 {hotel.location}</p>
          <div className="flex items-center gap-1 text-yellow-500 mt-1">
            <Star size={18} /> {hotel.rating?.toFixed(1) ?? 0}/5
          </div>
        </div>
        <p className="mt-4 text-gray-700">{hotel.description}</p>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((a) => (
            <span
              key={a}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(
            hotel.rooms.reduce((acc: Record<string, number[]>, room) => {
              if (!acc[room.type]) acc[room.type] = [room.price];
              else acc[room.type].push(room.price);
              return acc;
            }, {})
          ).map(([type, prices]) => {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleRoomBooking(type)}
                className="p-4 bg-white border rounded-xl shadow-sm cursor-pointer hover:bg-blue-100 transition text-left"
                tabIndex={0}
                aria-label={`Book a ${type} room`}
              >
                <h3 className="font-semibold text-lg mb-2 capitalize">
                  {type}
                </h3>
                <p className="text-blue-600 font-medium">
                  ₹{min === max ? `${min}` : `${min} - ${max}`} / night
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reviews</h2>
          <button
            onClick={() => setShowReviewModal(true)}
            className="text-sm bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Write a Review
          </button>
        </div>

        <div className="space-y-4">
          {hotel.reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            hotel.reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded p-4 shadow bg-white"
              >
                <p className="text-sm font-semibold">{review.user.name}</p>
                <p className="text-yellow-600 flex items-center gap-1">
                  <Star size={16} /> {review.rating}/5
                </p>
                <p className="text-gray-700 mt-1">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
