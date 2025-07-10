import { db } from '@/lib/db';
import { GQLContext } from '@/types/gqlContext';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authResolvers = {
  Mutation: {
    register: async (_: any, { input }: any, context: GQLContext) => {
      const { name, email, password } = input;
      const hashed = await bcrypt.hash(password, 10);
      const user = await context.db.user.create({ name, email, password: hashed });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!);
      return { token, user };
    },
    login: async (_: any, { input }: any, context: GQLContext) => {
      const { email, password } = input;
      const user = await context.db.user.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!);
      return { token, user };
    },
  },
};
