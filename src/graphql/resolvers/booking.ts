import { GQLContext } from "@/types/gqlContext";

export const bookingResolvers = {
  Query: {
    bookings: (_: any, __: any, context: GQLContext) => {
      if (!context.user) throw new Error("Not Authenticated");
      console.log("Fetching bookings for user:", context.user.id);
      return context.db.booking.findByUserOrAdmin(context.user);
    },
  },
  Mutation: {
    bookRoom: (_: any, { input }: any, context: GQLContext) =>
      context.db.booking.create(context.user?.id, input),
    cancelBooking: (_: any, { id }: any, context: GQLContext) =>
      context.db.booking.cancel(id),
    approveBooking: async (_: any, { id }: { id: string }, context: GQLContext) => {
      if (context.user?.role !== 'ADMIN') throw new Error('Unauthorized');
      return context.db.booking.approveBooking(id);
    },
  },
  Booking: {
    room: async (booking: any, _: any, context: GQLContext) => {
      const res = await context.db.query("SELECT * FROM rooms WHERE id = $1", [
        booking.roomId,
      ]);
      return res.rows[0];
    },
    user: async (booking: any, _: any, context: GQLContext) => {
      const res = await context.db.query("SELECT * FROM users WHERE id = $1", [
        booking.userId,
      ]);
      return res.rows[0];
    },
  },
};
