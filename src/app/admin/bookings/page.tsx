"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import {
  CalendarCheck,
  Users,
  BedDouble,
  TimerReset,
  Search,
  Building2,
  Hash,
} from "lucide-react";
import {
  getBookingForAdminQuery,
  approveBookingMutation,
} from "@/utils/queries";
import { formatDate } from "@/utils/date";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axiosClient.post("", {
          query: getBookingForAdminQuery,
        });

        const bookings = res.data.data.bookings ?? [];
        setBookings(bookings);
        setFilteredBookings(bookings);
      } catch (err) {
        alert("Failed to fetch bookings: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Debounce the search input (like PostgreSQL ILIKE)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter((b) => {
      const hotelName = b.room?.hotel?.name?.toLowerCase() || "";
      const roomType = b.room?.type?.toLowerCase() || "";
      const roomNumber = b.room?.roomNumber?.toString().toLowerCase() || "";

      return (
        hotelName.includes(debouncedSearch) ||
        roomType.includes(debouncedSearch) ||
        roomNumber.includes(debouncedSearch)
      );
    });

    setFilteredBookings(filtered);
  }, [debouncedSearch, bookings]);

  const approveBooking = async (id: string) => {
    try {
      const res = await axiosClient.post("", {
        query: approveBookingMutation,
        variables: { id },
      });

      const updatedBooking = res.data.data.approveBooking;
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: updatedBooking.status } : b
        )
      );
    } catch (err) {
      alert("Failed to approve booking: " + err);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading bookings...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        All Bookings
      </h1>

      {/* Search */}
      <div className="mb-8 max-w-md">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by hotel name, room type, or room number
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Taj, deluxe, 101"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center text-gray-600">No bookings found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-700">Booking</h3>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    b.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : b.status === "CANCELLED"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> {b.user?.name ?? "Unknown User"} (
                  {b.user?.email ?? "No email"})
                </p>

                <p className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Hotel: {b.room?.hotel?.name ?? "Unknown"}
                </p>

                <p className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Room: #{b.room?.roomNumber ?? "?"} (
                  {b.room?.type ?? "?"} room)
                </p>

                <p className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4" />
                  Capacity: {b.room?.capacity ?? "?"} guests
                </p>

                <b className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                </b>

                <p className="flex items-center gap-2">
                  <TimerReset className="w-4 h-4" />
                  {b.guests} guest(s)
                </p>

                <p className="text-blue-600 font-medium">
                  ₹{b.room?.price ?? "?"} / night
                </p>
              </div>

              <div className="text-xs text-gray-400 mt-3">
                Booking ID: {b.id.slice(0, 8)}...
              </div>

              {b.status === "PENDING" && (
                <button
                  onClick={() => approveBooking(b.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Approve Booking for Room #{b.room?.roomNumber ?? "?"} 
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
