"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteHotelMutation, getHotelsQuery } from "@/utils/queries";

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  images: string[];
  amenities: string[];
  rooms: { price: number }[];
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchHotels = async () => {
    const res = await axiosClient.post("", { query: getHotelsQuery });
    setHotels(res.data.data.hotels);
    setLoading(false);
  };

  const deleteHotel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    await axiosClient.post("", {
      query: deleteHotelMutation,
      variables: { id },
    });
    setHotels((prev) => prev.filter((h) => h.id !== id));
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) return <div className="p-8">Loading hotels...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Hotels</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
            onClick={() => router.push("/admin/hotels/add")}
          >
            + Add Hotel
          </button>
        </div>

        {hotels.length === 0 ? (
          <p className="text-gray-500">No hotels found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => {
              const minPrice = hotel.rooms.length
                ? Math.min(...hotel.rooms.map((r) => r.price))
                : null;

              return (
                <div
                  key={hotel.id}
                  className="relative bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-xl transition-all"
                >
                  <img
                    src={hotel.images?.[0] || "/placeholder.jpg"}
                    alt={hotel.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                      title="Edit"
                      onClick={() =>
                        router.push(`/admin/hotels/edit/${hotel.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 bg-white p-2 rounded-full shadow shadow-blue-300 ring-1 ring-blue-100"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteHotel(hotel.id)}
                      className="text-red-600 hover:text-red-800 bg-white p-2 rounded-full shadow shadow-red-300 ring-1 ring-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {hotel.name}
                    </h2>
                    <p className="text-sm text-gray-600">📍 {hotel.location}</p>
                    <p className="text-yellow-500">⭐ {hotel.rating ?? 0}</p>

                    {minPrice ? (
                      <p className="text-sm font-medium text-blue-700">
                        💰 From ₹{minPrice}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-gray-400">
                        No Room Prices Found
                      </p>
                    )}

                    {hotel.amenities?.length > 0 && (
                      <p className="text-xs text-gray-500">
                        🛎️ {hotel.amenities.slice(0, 4).join(" • ")}
                        {hotel.amenities.length > 4 && " • ..."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
