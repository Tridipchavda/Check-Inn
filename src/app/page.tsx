"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { getHotelsQuery } from "@/utils/queries";
import Link from "next/link";
import { MapPin, Calendar, Users } from "lucide-react";

export default function SearchHotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);

  const fetchHotels = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await axiosClient.post("", {
        query: getHotelsQuery,
        variables: { filter: filters },
      });

      const hotels = res.data?.data?.hotels;
      if (!hotels) {
        alert("Something went wrong while loading hotels.");
        return;
      }
      setHotels(hotels);
    } catch (err) {
      alert("Failed to fetch hotels: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = () => {
    const filter: any = {};
    if (city) filter.location = city;
    if (startDate) filter.availableFrom = startDate;
    if (endDate) filter.availableTo = endDate;
    fetchHotels(filter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      {/* Search Form */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-12 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Find Your Stay
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* City */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
            />
          </div>

          {/* Start Date */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onFocus={(e) => e.target.showPicker?.()}
              className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onFocus={(e) => e.target.showPicker?.()}
              className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
            />
          </div>

          {/* Guests */}
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
              placeholder="Guests"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 font-semibold text-sm shadow transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Hotel Results */}
      <div className="max-w-6xl mx-auto">
        {(() => {
          if (loading) {
            return (
              <div className="text-center text-gray-600">Loading hotels...</div>
            );
          }
          if (hotels.length === 0) {
            return (
              <div className="text-center text-gray-500">No hotels found.</div>
            );
          }
          return (
            <div className="space-y-6">
              {hotels.map((hotel) => {
                const minPrice = hotel.rooms?.length
                  ? Math.min(...hotel.rooms.map((r: any) => r.price))
                  : null;

                const maxPrice = hotel.rooms?.length
                  ? Math.max(...hotel.rooms.map((r: any) => r.price))
                  : null;

                // Generate a key for amenities using amenity value and hotel id
                const getAmenityKey = (a: string, idx: number) =>
                  `${hotel.id}-${a}`;

                return (
                  <Link
                    key={hotel.id}
                    href={{
                      pathname: `/hotels/${hotel.id}`,
                      query: {
                        startDate,
                        endDate,
                        guests,
                      },
                    }}
                  >
                    <div className="flex flex-col sm:flex-row border border-gray-200 rounded-xl shadow hover:shadow-md transition bg-white cursor-pointer p-4 gap-4">
                      <img
                        src={hotel.images?.[0] ?? "/placeholder.jpg"}
                        alt={hotel.name}
                        className="w-full sm:w-60 h-44 object-cover rounded-md"
                      />

                      <div className="flex-1 flex flex-col justify-space-around gap-2 ml-3">
                        {/* Top Info */}
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {hotel.name}
                          </h2>

                          <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                            <MapPin size={14} /> {hotel.location}
                          </p>

                          {/* Star Rating */}
                          <p className="text-yellow-500 text-sm mt-1">
                            {Array(Math.round(hotel.rating ?? 0))
                              .fill("★")
                              .join(" ")}{" "}
                            ({hotel.rating?.toFixed(1) ?? "0.0"} / 5)
                          </p>

                          {/* Description */}
                          {hotel.description && (
                            <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                              {hotel.description}
                            </p>
                          )}

                          {/* Amenities */}
                          {hotel.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {hotel.amenities
                                .slice(0, 5)
                                .map((a: string, idx: number) => (
                                  <span
                                    key={getAmenityKey(a, idx)}
                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {a}
                                  </span>
                                ))}
                              {hotel.amenities.length > 5 && (
                                <span className="text-xs text-gray-500">
                                  +{hotel.amenities.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price & Meta */}
                        <div className="flex justify-between items-center text-md text-gray-700 mt-1">
                          <div>
                            {minPrice ? (
                              <p className="text-gray-700 font-semibold">
                                ₹{minPrice} - ₹{maxPrice} / night
                              </p>
                            ) : (
                              <p className="text-gray-400">No pricing info</p>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 text-right">
                            {hotel.reviews?.length ?? 0} reviews •{" "}
                            {hotel.rooms?.length ?? 0} room types
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
