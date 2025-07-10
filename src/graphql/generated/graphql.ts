import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AddHotelInput = {
  amenities: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images: Array<Scalars['String']['input']>;
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type AddRoomInput = {
  capacity: Scalars['Int']['input'];
  hotelId: Scalars['ID']['input'];
  price: Scalars['Float']['input'];
  roomNumber?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Availability = {
  __typename?: 'Availability';
  date: Scalars['String']['output'];
  isAvailable: Scalars['Boolean']['output'];
};

export type BookRoomInput = {
  checkIn: Scalars['DateTime']['input'];
  checkOut: Scalars['DateTime']['input'];
  guests: Scalars['Int']['input'];
  roomId: Scalars['ID']['input'];
};

export type Booking = {
  __typename?: 'Booking';
  checkIn: Scalars['DateTime']['output'];
  checkOut: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  guests: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  room: Room;
  status: BookingStatus;
  user: User;
};

export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

export type Hotel = {
  __typename?: 'Hotel';
  amenities: Array<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  rating?: Maybe<Scalars['Float']['output']>;
  reviews: Array<Review>;
  rooms: Array<Room>;
};

export type HotelFilterInput = {
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  availableFrom?: InputMaybe<Scalars['String']['input']>;
  availableTo?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  minRating?: InputMaybe<Scalars['Float']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addHotel: Hotel;
  addRoom: Room;
  approveBooking: Booking;
  bookRoom: Booking;
  cancelBooking: Booking;
  deleteHotel?: Maybe<Scalars['Boolean']['output']>;
  leaveReview: Review;
  login?: Maybe<AuthPayload>;
  register?: Maybe<AuthPayload>;
  setRoomAvailability: Availability;
  updateHotel: Hotel;
  updateRoom: Room;
};


export type MutationAddHotelArgs = {
  input: AddHotelInput;
};


export type MutationAddRoomArgs = {
  input: AddRoomInput;
};


export type MutationApproveBookingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationBookRoomArgs = {
  input: BookRoomInput;
};


export type MutationCancelBookingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteHotelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLeaveReviewArgs = {
  input: ReviewInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSetRoomAvailabilityArgs = {
  input: SetAvailabilityInput;
};


export type MutationUpdateHotelArgs = {
  id: Scalars['ID']['input'];
  input: AddHotelInput;
};


export type MutationUpdateRoomArgs = {
  id: Scalars['ID']['input'];
  input: UpdateRoomInput;
};

export type Query = {
  __typename?: 'Query';
  bookings: Array<Booking>;
  hotel?: Maybe<Hotel>;
  hotels: Array<Hotel>;
  me?: Maybe<User>;
  rooms: Array<Room>;
  users: Array<User>;
};


export type QueryHotelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryHotelsArgs = {
  filter?: InputMaybe<HotelFilterInput>;
};


export type QueryMeArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRoomsArgs = {
  hotelId?: InputMaybe<Scalars['ID']['input']>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  hotel: Hotel;
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  user: User;
};

export type ReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  hotelId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
  Staff = 'STAFF'
}

export type Room = {
  __typename?: 'Room';
  availability: Array<Availability>;
  capacity: Scalars['Int']['output'];
  hotel: Hotel;
  id: Scalars['ID']['output'];
  price: Scalars['Float']['output'];
  roomNumber?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type SetAvailabilityInput = {
  date: Scalars['String']['input'];
  isAvailable: Scalars['Boolean']['input'];
  roomId: Scalars['ID']['input'];
};

export type UpdateRoomInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  hotelId?: InputMaybe<Scalars['ID']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  roomNumber?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  bookings: Array<Booking>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: Role;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddHotelInput: AddHotelInput;
  AddRoomInput: AddRoomInput;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Availability: ResolverTypeWrapper<Availability>;
  BookRoomInput: BookRoomInput;
  Booking: ResolverTypeWrapper<Booking>;
  BookingStatus: BookingStatus;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Hotel: ResolverTypeWrapper<Hotel>;
  HotelFilterInput: HotelFilterInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  Review: ResolverTypeWrapper<Review>;
  ReviewInput: ReviewInput;
  Role: Role;
  Room: ResolverTypeWrapper<Room>;
  SetAvailabilityInput: SetAvailabilityInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateRoomInput: UpdateRoomInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddHotelInput: AddHotelInput;
  AddRoomInput: AddRoomInput;
  AuthPayload: AuthPayload;
  Availability: Availability;
  BookRoomInput: BookRoomInput;
  Booking: Booking;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  Hotel: Hotel;
  HotelFilterInput: HotelFilterInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LoginInput: LoginInput;
  Mutation: {};
  Query: {};
  RegisterInput: RegisterInput;
  Review: Review;
  ReviewInput: ReviewInput;
  Room: Room;
  SetAvailabilityInput: SetAvailabilityInput;
  String: Scalars['String']['output'];
  UpdateRoomInput: UpdateRoomInput;
  User: User;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AvailabilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Availability'] = ResolversParentTypes['Availability']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAvailable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Booking'] = ResolversParentTypes['Booking']> = {
  checkIn?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  checkOut?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  guests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  room?: Resolver<ResolversTypes['Room'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['BookingStatus'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type HotelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hotel'] = ResolversParentTypes['Hotel']> = {
  amenities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  reviews?: Resolver<Array<ResolversTypes['Review']>, ParentType, ContextType>;
  rooms?: Resolver<Array<ResolversTypes['Room']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addHotel?: Resolver<ResolversTypes['Hotel'], ParentType, ContextType, RequireFields<MutationAddHotelArgs, 'input'>>;
  addRoom?: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<MutationAddRoomArgs, 'input'>>;
  approveBooking?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationApproveBookingArgs, 'id'>>;
  bookRoom?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationBookRoomArgs, 'input'>>;
  cancelBooking?: Resolver<ResolversTypes['Booking'], ParentType, ContextType, RequireFields<MutationCancelBookingArgs, 'id'>>;
  deleteHotel?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteHotelArgs, 'id'>>;
  leaveReview?: Resolver<ResolversTypes['Review'], ParentType, ContextType, RequireFields<MutationLeaveReviewArgs, 'input'>>;
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  setRoomAvailability?: Resolver<ResolversTypes['Availability'], ParentType, ContextType, RequireFields<MutationSetRoomAvailabilityArgs, 'input'>>;
  updateHotel?: Resolver<ResolversTypes['Hotel'], ParentType, ContextType, RequireFields<MutationUpdateHotelArgs, 'id' | 'input'>>;
  updateRoom?: Resolver<ResolversTypes['Room'], ParentType, ContextType, RequireFields<MutationUpdateRoomArgs, 'id' | 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  bookings?: Resolver<Array<ResolversTypes['Booking']>, ParentType, ContextType>;
  hotel?: Resolver<Maybe<ResolversTypes['Hotel']>, ParentType, ContextType, RequireFields<QueryHotelArgs, 'id'>>;
  hotels?: Resolver<Array<ResolversTypes['Hotel']>, ParentType, ContextType, Partial<QueryHotelsArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryMeArgs>>;
  rooms?: Resolver<Array<ResolversTypes['Room']>, ParentType, ContextType, Partial<QueryRoomsArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type ReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hotel?: Resolver<ResolversTypes['Hotel'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = {
  availability?: Resolver<Array<ResolversTypes['Availability']>, ParentType, ContextType>;
  capacity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hotel?: Resolver<ResolversTypes['Hotel'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  roomNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  bookings?: Resolver<Array<ResolversTypes['Booking']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Availability?: AvailabilityResolvers<ContextType>;
  Booking?: BookingResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Hotel?: HotelResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  Room?: RoomResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

