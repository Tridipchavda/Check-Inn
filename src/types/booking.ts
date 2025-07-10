import { z } from 'zod';

export const BookingInputSchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format for checkIn",
  }),
  checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format for checkOut",
  }),
  guests: z.number().min(1),
});

export type BookingInput = z.infer<typeof BookingInputSchema>;
