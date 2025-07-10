"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { getMyBookingsQuery, cancelBookingMutation } from "@/utils/queries";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Hotel,
  Users,
  MapPin,
  Trash2,
} from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const res = await axiosClient.post("", {
        query: getMyBookingsQuery,
      });
      setBookings(res.data.data.bookings ?? []);
    } catch (err) {
      alert("Failed to load bookings" + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const res = await axiosClient.post("", {
        query: cancelBookingMutation,
        variables: { id },
      });

      if (res.data.errors) {
        alert("Cancel failed: " + res.data.errors[0].message);
      } else {
        alert("Booking cancelled.");
        fetchBookings();
      }
    } catch (err) {
      alert("Error cancelling booking." + err);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-lg font-medium">
        Loading your bookings...
      </div>
    );

  if (bookings.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        You haven’t made any bookings yet.{" "}
        <button
          className="text-blue-600 underline hover:text-blue-800"
          onClick={() => router.push("/")}
        >
          Explore hotels →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center">
        My Bookings
      </h1>

      <div className="space-y-10">
        {bookings.map((booking) => {
          const hotel = booking.room.hotel;
          const img = hotel.images?.[0];

          return (
            <div
              key={booking.id}
              className="rounded-2xl border border-gray-200 shadow hover:shadow-md transition bg-white overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Hotel Image */}
                <div className="w-full md:w-64 h-52 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
                  <img
                    src={img}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col justify-between w-full">
                  <div className="flex justify-between items-start gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                          {hotel.name}
                        </h2>
                        {(() => {
                          let statusClass = "";
                          if (booking.status === "CONFIRMED") {
                            statusClass = "bg-green-100 text-green-700";
                          } else if (booking.status === "PENDING") {
                            statusClass = "bg-yellow-100 text-yellow-700";
                          } else {
                            statusClass = "bg-red-100 text-red-700";
                          }
                          return (
                            <span
                              className={`text-sm font-semibold px-3 py-1 rounded-full ${statusClass}`}
                            >
                              {booking.status}
                            </span>
                          );
                        })()}
                      </div>

                      <p className="flex items-center gap-1 text-gray-500 mt-1 text-sm">
                        <MapPin size={14} /> {hotel.location}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-4 text-gray-700 text-sm">
                        <p className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          <span>
                            {format(new Date(booking.checkIn), "dd MMM yyyy")} →{" "}
                            {format(new Date(booking.checkOut), "dd MMM yyyy")}
                          </span>
                        </p>

                        <p className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{booking.guests} guest(s)</span>
                        </p>

                        <p className="flex items-center gap-2">
                          <Hotel size={16} />
                          <span>Type: {booking.room.type}</span>
                        </p>

                        <p className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            Booked on:{" "}
                            {format(new Date(booking.createdAt), "dd MMM yyyy")}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Cancel Button */}
                    <div className="mt-2 ml-4">
                      {booking.status === "PENDING" ? (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center gap-2 text-red-600 font-medium text-sm hover:text-red-700 border border-red-200 px-3 py-2 rounded-md shadow-sm hover:shadow"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <div className="h-9 w-20" /> // Empty space for alignment
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
