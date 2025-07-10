'use client';

import { useState, useEffect } from 'react';
import axiosClient from '@/utils/axiosClient';
import { addRoomMutation, getHotelsQuery } from '@/utils/queries';
import {
  Building2,
  Hash,
  Type,
  Users,
  IndianRupee,
} from 'lucide-react';

export default function AddRoomPage() {
  const [form, setForm] = useState({
    hotelId: '',
    capacity: 1,
    price: 0,
    roomNumber: '',
    type: '',
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      const res = await axiosClient.post('', { query: getHotelsQuery });
      setHotels(res.data.data.hotels);
    };
    fetchHotels();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log({ ...form, capacity: +form.capacity, price: +form.price } )
      await axiosClient.post('', {
        query: addRoomMutation,
        variables: { input: { ...form, capacity: +form.capacity, price: +form.price } },
      });
      alert('✅ Room added successfully');
    } catch (err: any) {
      alert('❌ Error adding room'+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🛏️ Add New Room</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 shadow-lg rounded-xl border border-gray-200"
      >
        {/* Hotel Selection */}
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
            <Building2 size={16} /> Hotel
          </label>
          <select
            name="hotelId"
            value={form.hotelId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
          >
            <option value="">Select Hotel</option>
            {hotels.map((hotel: any) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Number */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
            <Hash size={16} /> Room Number
          </label>
          <input
            name="roomNumber"
            value={form.roomNumber}
            onChange={handleChange}
            placeholder="E.g. 205 or A12"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        {/* Room Type */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
            <Type size={16} /> Room Type
          </label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="E.g. Deluxe, Standard"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
            <Users size={16} /> Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="E.g. 2"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
            <IndianRupee size={16} /> Price per night
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="E.g. 3500"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Submitting...' : '➕ Add Room'}
        </button>
      </form>
    </div>
  );
}
