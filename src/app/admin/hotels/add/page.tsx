'use client';

import { useState } from 'react';
import axiosClient from '@/utils/axiosClient';
import { useRouter } from 'next/navigation';
import { addHotelMutation } from '@/utils/queries';

const ALL_AMENITIES = [
  'WiFi',
  'Pool',
  'Spa',
  'Parking',
  'Restaurant',
  'Fitness Center',
  'Bar',
  'Pet-Friendly',
  'Airport Shuttle',
];

export default function AddHotelPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    amenities: [] as string[],
    images: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const base64Promises = files.map(
      file =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    const base64Images = await Promise.all(base64Promises);
    setForm(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
  };

  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosClient.post('', {
        query: addHotelMutation,
        variables: {
          input: {
            name: form.name,
            location: form.location,
            description: form.description,
            amenities: form.amenities,
            images: form.images,
          },
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { errors } = res.data;
      if (errors) throw new Error(errors[0].message);

      alert('Hotel added successfully');
      router.push('/admin/hotels');
    } catch (err: any) {
      alert(err.message ?? 'Error adding hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Hotel</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <input
          name="name"
          placeholder="Hotel Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Location */}
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border px-4 py-2 rounded"
        />

        {/* Image Upload */}
        <div>
          <label htmlFor="upload-images" className="block font-semibold mb-1">Upload Hotel Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full border px-4 py-2 rounded file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {form.images.map((src, idx) => (
                <div key={"img_"+idx} className="relative group">
                  <img
                    src={src || '/placeholder.jpg'}
                    alt={`Preview ${idx}`}
                    className="h-32 w-full object-cover rounded shadow"
                    onError={(e: any) => (e.target.src = '/placeholder.jpg')}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-white text-red-600 hover:bg-red-600 hover:text-white border border-red-300 rounded-full p-1 shadow transition-opacity opacity-90 group-hover:opacity-100 text-xs"
                    title="Remove"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div>
          <label htmlFor="select-amenities" className="block font-semibold mb-2">Select Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_AMENITIES.map(amenity => (
              <label
                key={amenity}
                className="flex items-center space-x-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="accent-blue-600"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
        >
          {loading ? 'Submitting...' : 'Add Hotel'}
        </button>
      </form>
    </div>
  );
}
