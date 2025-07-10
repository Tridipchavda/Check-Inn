"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { bookRoomMutation, getHotelViewInfoQuery } from "@/utils/queries";
import { HotelWithRooms } from "@/types/hotel";
import { calculateBookingCost } from "@/utils/booking";
import { Star } from "lucide-react";

export default function BookRoomPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const hotelId = searchParams?.get("hotelId");
  const startDate = searchParams?.get("startDate");
  const endDate = searchParams?.get("endDate");
  const guests = Number(searchParams?.get("guests") ?? 1);
  const roomType = searchParams?.get("roomType");

  const [hotel, setHotel] = useState<HotelWithRooms | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) return;
    axiosClient
      .post("", {
        query: getHotelViewInfoQuery,
        variables: { id: hotelId },
      })
      .then((res) => setHotel(res.data.data.hotel))
      .catch((err) => alert("Failed to fetch hotel details: " + err))
      .finally(() => setLoading(false));
  }, [hotelId]);

  const handleBookNow = async () => {
    if (!hotel || !startDate || !endDate || !guests || !roomType) {
      alert("Missing booking details.");
      return;
    }

    const matchingRooms = hotel.rooms.filter((r) => r.type === roomType);
    if (matchingRooms.length === 0) {
      alert("No room of selected type found.");
      return;
    }

    const room = matchingRooms[0];

    // ✅ Convert to ISO string format (required by GraphQL DateTime scalar)
    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    console.log(isoEndDate, isoStartDate);

    try {
      const res = await axiosClient.post("", {
        query: bookRoomMutation,
        variables: {
          input: {
            roomId: room.id,
            checkIn: isoStartDate,
            checkOut: isoEndDate,
            guests,
          },
        },
      });

      if (res.data.errors) {
        alert("Failed to book: " + res.data.errors[0].message);
      } else {
        alert("Booking successful!");
        router.push("/my-bookings");
      }
    } catch (err) {
      alert("Booking failed: " + err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!hotel || !roomType)
    return (
      <div className="text-center text-red-600">Invalid booking details.</div>
    );

  const matchingRooms = hotel.rooms.filter((r) => r.type === roomType);
  if (matchingRooms.length === 0)
    return <div className="text-center text-red-600">Room type not found.</div>;

  const room = matchingRooms[0];
  const nightsRaw =
    (new Date(endDate!).getTime() - new Date(startDate!).getTime()) /
    (1000 * 60 * 60 * 24);

  const nights = Math.max(1, Math.round(nightsRaw));

  const { summary, total } = calculateBookingCost({
    price: room.price,
    capacity: room.capacity,
    guests,
    nights,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 text-sm sm:text-base">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        {/* Left - Hotel Info */}
        <div className="space-y-10 min-w-[400px] min-h-[500px]">
          {/* Images */}
          <div
            className={`grid gap-3 ${
              hotel.images.length === 1
                ? "grid-cols-1"
                : hotel.images.length === 2
                ? "grid-cols-2"
                : hotel.images.length === 3
                ? "grid-cols-2 sm:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            }`}
          >
            {hotel.images.map((img) => (
              <img
                key={img}
                src={img}
                alt={hotel.name}
                className="rounded-md object-cover w-full h-40 sm:h-44 md:h-48"
              />
            ))}
          </div>

          {/* Hotel Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{hotel.name}</h1>
            <p className="text-gray-600 mt-1">📍 {hotel.location}</p>
            <div className="flex items-center gap-1 text-yellow-500 mt-2 text-sm">
              <Star size={16} /> {hotel.rating?.toFixed(1) ?? 0}/5
            </div>
            <p className="text-gray-700 mt-4 leading-relaxed">
              {hotel.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <span
                  key={a}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Reviews</h2>
            <div className="space-y-3">
              {hotel.reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                hotel.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border bg-white rounded-lg p-4 shadow-sm"
                  >
                    <p className="font-semibold text-gray-800 text-sm">
                      {review.user.name}
                    </p>
                    <div className="flex items-center gap-1 text-yellow-600 text-sm">
                      <Star size={14} /> {review.rating}/5
                    </div>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right - Booking Summary */}
        <div className="bg-white border rounded-2xl shadow-xl p-8 h-fit sticky top-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
            Booking Summary
          </h2>

          <div className="space-y-3 text-[16px] text-gray-700 leading-relaxed">
            <p>
              <span className="font-medium text-gray-500">Check-in:</span>{" "}
              <span className="font-semibold text-gray-800">{startDate}</span>
            </p>
            <p>
              <span className="font-medium text-gray-500">Check-out:</span>{" "}
              <span className="font-semibold text-gray-800">{endDate}</span>
            </p>
            <p>
              <span className="font-medium text-gray-500">Guests:</span>{" "}
              <span className="font-semibold text-gray-800">{guests}</span>
            </p>
            <p>
              <span className="font-medium text-gray-500">Room Details:</span>{" "}
              <span className="font-semibold text-gray-800 capitalize">
                {roomType} • Up to {room.capacity} guests
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-500">Room Price:</span>{" "}
              <span className="font-semibold text-blue-700">
                ₹{room.price} / night
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-500">Total Nights:</span>{" "}
              <span className="font-semibold text-gray-800">{nights}</span>
            </p>
          </div>

          <hr className="my-6 border-gray-300" />

          <div className="bg-gray-100 p-5 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Cost Breakdown
            </h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {summary}
            </pre>
          </div>

          <p className="text-2xl font-bold text-blue-600 mt-6 text-right">
            Total: ₹{total.toFixed(0)}
          </p>

          <button
            onClick={handleBookNow}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md text-lg transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
