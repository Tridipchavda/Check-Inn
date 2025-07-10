import { GQLContext } from "@/types/gqlContext";

export const hotelResolvers = {
  Query: {
    hotels: (_: any, { filter }: any, context: GQLContext) =>
      context.db.hotel.findByFilter(filter),
    hotel: (_: any, { id }: any, context: GQLContext) => context.db.hotel.findById(id),
    rooms: (_: any, { hotelId }: any, context: GQLContext) =>
      context.db.room.findByHotel(hotelId),
  },
  Mutation: {
    addHotel: (_: any, { input }: any, context: GQLContext) => {
      if (context.user?.role !== "ADMIN") throw new Error("Forbidden");
      return context.db.hotel.create(input);
    },
    updateHotel: (_: any, { id, input }: any, context: GQLContext) => {
      if (context.user?.role !== "ADMIN") throw new Error("Forbidden");
      return context.db.hotel.update(id, input);
    },
    updateRoom: (_: any, { id, input }: any, context: GQLContext) => {
      if (context.user?.role !== "ADMIN") throw new Error("Forbidden");
      return context.db.room.update(id, input);
    },
    deleteHotel: (_: any, { id }: any, context: GQLContext) => {
      if (context.user?.role !== "ADMIN") throw new Error("Forbidden");
      return context.db.hotel.delete(id);
    },
  },
  Hotel: {
    rooms: async (hotel: any, _: any, context: GQLContext) => {
      const rooms = await context.db.room.findByHotel(hotel.id);
      return rooms || []; 
    },
    reviews: async (hotel: any, _: any, context: GQLContext) => {
      return context.db.review.findByHotel(hotel.id);
    },
  },
};
