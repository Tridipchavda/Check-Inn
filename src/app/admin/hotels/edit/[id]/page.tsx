"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { getHotelByIdQuery, updateHotelMutation } from "@/utils/queries";

const ALL_AMENITIES = [
  "WiFi",
  "Pool",
  "Spa",
  "Parking",
  "Restaurant",
  "Fitness Center",
  "Bar",
  "Pet-Friendly",
  "Airport Shuttle",
];

export default function EditHotelPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    images: [] as string[],
    amenities: [] as string[],
  });

  useEffect(() => {
    const fetchHotel = async () => {
      const res = await axiosClient.post("", {
        query: getHotelByIdQuery,
        variables: { id },
      });

      const hotel = res.data.data.hotel;
      if (!hotel) return alert("Hotel not found");

      setForm({
        name: hotel.name,
        location: hotel.location,
        description: hotel.description ?? "",
        images: hotel.images?.length ? hotel.images : [],
        amenities: hotel.amenities ?? [],
      });

      setImages(hotel.images ?? []);
      setLoading(false);
    };

    if (id) fetchHotel();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const base64Promises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    const base64Images = await Promise.all(base64Promises);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...base64Images] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosClient.post("", {
      query: updateHotelMutation,
      variables: { id, input: form },
    });
    router.push("/admin/hotels");
  };

  if (loading) return <div className="p-10 text-center">Loading hotel...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Hotel</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 shadow-xl rounded-xl"
      >
        {/* Name */}
        <div>
          <label htmlFor="hotel-name" className="block mb-1 font-semibold">Hotel Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block mb-1 font-semibold">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="images" className="block mb-2 font-semibold">Hotel Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.images.map((src, index) => (
              <div key={"hotel_img_"+index} className="relative group">
                <img
                  src={src || "/placeholder.jpg"}
                  alt={`Hotel ${index + 1}`}
                  className="rounded-lg border shadow h-32 w-full object-cover"
                  onError={(e: any) => (e.target.src = "/placeholder.jpg")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute top-1 right-1 bg-white text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded-full shadow transition-opacity opacity-60 group-hover:opacity-80 text-xs p-1"
                  title="Remove Image"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label htmlFor="amenities" className="block mb-2 font-semibold">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="form-checkbox text-blue-600"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
