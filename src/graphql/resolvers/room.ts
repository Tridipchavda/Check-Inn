import { GQLContext } from "@/types/gqlContext";

export const roomResolvers = {
  Room: {
    hotel: (room: any, _args: any, context: GQLContext) => context.db.room.hotel(room),
    availability: (room: any, _args: any, context: GQLContext) => context.db.room.availability(room),
  },
  Mutation: {
    addRoom: async (_: any, { input }: any, context: GQLContext) => {
      if (context.user?.role !== "ADMIN") throw new Error("Unauthorized");
      return context.db.room.add(input);
    },
    setRoomAvailability: async (_: any, { input }: any, context: GQLContext) => {
      if (context.user?.role !== "ADMIN") throw new Error("Unauthorized");
      const { roomId, date, isAvailable } = input;
      return context.db.availability.set(roomId, date, isAvailable);
    },
  },
  Query: {
    rooms: async (_: any, args: { hotelId?: string }, context: GQLContext) => {
      if (args.hotelId) {
        return context.db.room.findByHotel(args.hotelId);
      }
      // Fetch all rooms (admin only)
      if (context.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return context.db.room.findAll();
    },
  },
};
