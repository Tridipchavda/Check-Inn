"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import {
  addRoomAvailabilityMutation,
  getRoomsAvailabilityQuery,
} from "@/utils/queries";
import { useRouter } from "next/navigation";

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [newAvailability, setNewAvailability] = useState<
    Record<string, string>
  >({});
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axiosClient.post("", {
          query: getRoomsAvailabilityQuery,
        });
        setRooms(res.data.data.rooms);
        setFilteredRooms(res.data.data.rooms);
      } catch (err) {
        alert("Failed to fetch rooms" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const hotelNames = Array.from(
    new Set(rooms.map((r) => r.hotel?.name).filter(Boolean))
  );
  const roomTypes = Array.from(
    new Set(rooms.map((r) => r.type).filter(Boolean))
  );

  useEffect(() => {
    const filtered = rooms.filter((room) => {
      const hotelMatch = !selectedHotel || room.hotel?.name === selectedHotel;
      const typeMatch = !selectedRoomType || room.type === selectedRoomType;
      const dateMatch =
        !selectedDate ||
        room.availability?.some(
          (a: any) => a.date === selectedDate && a.isAvailable
        );
      return hotelMatch && typeMatch && dateMatch;
    });
    setFilteredRooms(filtered);
  }, [selectedHotel, selectedRoomType, selectedDate, rooms]);

  const handleAddAvailability = async (roomId: string) => {
    const date = newAvailability[roomId];
    if (!date) return alert("Please select a date");

    try {
      await axiosClient.post("", {
        query: addRoomAvailabilityMutation,
        variables: {
          input: {
            roomId,
            date,
            isAvailable: true,
          },
        },
      });

      alert("Availability added!");
      setNewAvailability((prev) => ({ ...prev, [roomId]: "" }));

      // Optionally, refetch room availability
      const res = await axiosClient.post("", {
        query: getRoomsAvailabilityQuery,
      });
      setRooms(res.data.data.rooms);
      setFilteredRooms(res.data.data.rooms);
    } catch (err) {
      alert("Failed to add availability"+err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading rooms...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage All Rooms</h1>
        <button
          onClick={() => router.push("/admin/rooms/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">All Hotels</option>
          {hotelNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="">All Room Types</option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl shadow p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-800">
              Room {room.roomNumber ?? "N/A"} – {room.type}
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              Capacity: {room.capacity} | ₹{room.price} / night
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Hotel: <strong>{room.hotel?.name}</strong>
            </p>

            <div className="mb-3">
              <h3 className="font-medium mb-1 text-gray-700">Availability:</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {room.availability?.map((a: any) => (
                  <span
                    key={a.date}
                    className={`px-2 py-1 rounded text-center ${
                      a.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.date}
                  </span>
                )) ?? <p>No availability data</p>}
              </div>
            </div>

            {/* Add availability section */}
            <div className="mt-4">
              <label htmlFor="add-availability" className="block text-sm font-medium mb-1 text-gray-700">
                Add Availability:
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newAvailability[room.id] || ""}
                  onChange={(e) =>
                    setNewAvailability((prev) => ({
                      ...prev,
                      [room.id]: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={() => handleAddAvailability(room.id)}
                  className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
