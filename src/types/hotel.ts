import { z } from 'zod';
import { Room } from './room';
import { Review } from './review';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  images: string[];
  amenities: string[];
}

export const HotelInputSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
});

export type HotelInput = z.infer<typeof HotelInputSchema>;

export const UpdateHotelInputSchema = HotelInputSchema.partial();
export type UpdateHotelInput = z.infer<typeof UpdateHotelInputSchema>;

export interface HotelWithRooms extends Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  images: string[];
  amenities: string[];
  rooms: Room[];
  reviews: Review[];
}

