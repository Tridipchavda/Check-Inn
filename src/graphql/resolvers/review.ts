import { GQLContext } from "@/types/gqlContext";

export const reviewResolvers = {
  Review: {
    user: (review: any, _args: any, context: GQLContext) =>
      context.db.user.findById(review.userId),
    hotel: (review: any, _args: any, context: GQLContext) =>
      context.db.hotel.findById(review.hotelId),
  },
  Mutation: {
    leaveReview: (_: any, { input }: any, context: GQLContext) => {
      if (!context.user) throw new Error("Not authenticated");
      const { id: userId } = context.user;
      const { hotelId, rating, comment } = input;
      return context.db.review.create({ userId, hotelId, rating, comment });
    },
  },
};
