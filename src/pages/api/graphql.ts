import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs, resolvers } from "@/graphql";
import { JwtPayload, verify } from "jsonwebtoken";
import { db } from "@/lib/db";
import { GQLContext } from "@/types/gqlContext";


const server = new ApolloServer<GQLContext>({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server, {
  context: async ({ headers }) => {
    const auth = headers.authorization;
    const user = getUserFromReq(auth);

    if (!user) {
      return { db, user: undefined }; 
    }

    return { user, db };
  },
});

const getUserFromReq = (auth?: string): JwtPayload | undefined => {
  if (!auth?.startsWith("Bearer ")) return undefined;

  try {
    return verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET!) as JwtPayload;
  } catch (err) {
    console.warn("Token verification failed:", err);
    return undefined;
  }
};

