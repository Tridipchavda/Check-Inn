import { z } from 'zod';

export const ReviewInputSchema = z.object({
  userId: z.string().uuid(),
  hotelId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type ReviewInput = z.infer<typeof ReviewInputSchema>;

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}