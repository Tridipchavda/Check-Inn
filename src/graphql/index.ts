import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import path from 'path';
import { userResolvers } from './resolvers/user';
import { authResolvers } from './resolvers/auth';
import { hotelResolvers } from './resolvers/hotels';
import { bookingResolvers } from './resolvers/booking';
import { reviewResolvers } from './resolvers/review';
import { roomResolvers } from './resolvers/room';
import { dateTime } from './resolvers/datetime';


const schemaPath = path.join(process.cwd(), 'src', 'graphql', 'schemas'); // absolute path
const typesArray = loadFilesSync(schemaPath, {
  extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers([
  userResolvers,
  authResolvers,
  hotelResolvers,
  bookingResolvers,
  reviewResolvers,
  roomResolvers,
  dateTime,
]);



export { typeDefs, resolvers };
