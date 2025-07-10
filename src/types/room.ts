import { z } from 'zod';

export const AddRoomInputSchema = z.object({
  hotelId: z.string().uuid(),
  capacity: z.number().min(1),
  price: z.number().nonnegative(),
  roomNumber: z.string().optional(),
  type: z.string().optional(),
});

export type AddRoomInput = z.infer<typeof AddRoomInputSchema>;

export const UpdateRoomInputSchema = z.object({
  capacity: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  roomNumber: z.string().optional(),
  type: z.string().optional(),
  hotelId: z.string().uuid().optional(),
});
export type UpdateRoomInput = z.infer<typeof UpdateRoomInputSchema>;

export interface Room {
  id: string;
  type: string;
  price: number;
  capacity: number;
}
