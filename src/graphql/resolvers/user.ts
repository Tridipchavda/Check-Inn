import { GQLContext } from "@/types/gqlContext";

export const userResolvers = {
  Query: {
    me: async (_: any, args: { id?: string; name?: string; email?: string }, context: GQLContext) => {
      const { id, name, email } = args;

      if (id) return context.db.user.findById(id);
      if (email) return context.db.user.findByEmail(email);
      if (name) return context.db.user.findByName(name);
      if (context.user?.id) return context.db.user.findById(context.user.id);

      throw new Error('Must provide ID, email, name, or be authenticated');
    },
    users: async (_: any, __: any, context: GQLContext) => {
      if (context.user?.role !== 'ADMIN') throw new Error('Forbidden');
      return context.db.user.findAll();
    },
  },
};
