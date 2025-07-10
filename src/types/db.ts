import { JwtPayload } from "jsonwebtoken";
import { HotelInput, UpdateHotelInput } from "./hotel";
import { AddRoomInput, UpdateRoomInput } from "./room";
import { BookingInput } from "./booking";
import { ReviewInput } from "./review";

export interface DB {
  query: (text: string, params?: any[]) => Promise<any>;

  user: {
    findById(id: string): Promise<any>;
    findAll(): Promise<any[]>;
    findByEmail(email: string): Promise<any>;
    findByName(name: string): Promise<any>;
    create(data: {
      name: string;
      email: string;
      password: string;
    }): Promise<any>;
  };

  hotel: {
    findAll(filter?: Partial<Pick<HotelInput, "location">>): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByFilter(filter?: {
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      amenities?: string[];
      minRating?: number;
      availableFrom?: string;
      availableTo?: string;
    }) : Promise<any[]>;
    create(data: HotelInput): Promise<any>;
    update(id: string, data: UpdateHotelInput): Promise<any>;
    delete(id: string): Promise<boolean>;
  };

  room: {
    findByHotel(hotelId: string): Promise<any[]>;
    findAll(): Promise<any[]>;
    hotel(room: { hotelId: string }): Promise<any>;
    availability(room: {
      id: string;
    }): Promise<{ date: string; isAvailable: boolean }[]>;
    update(id: string, data: UpdateRoomInput): Promise<any>;
    add(data: AddRoomInput): Promise<any>;
  };

  booking: {
    findByUser(userId: string): Promise<any[]>;
    findByUserOrAdmin(user: JwtPayload): Promise<any[]>;
    create(userId: string, input: BookingInput): Promise<any>;
    approveBooking(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
  };

  review: {
    create(data: ReviewInput): Promise<any>;
    findByHotel(hotelId: string): Promise<any[]>;
  };

  availability: {
    find(roomId: string): Promise<any[]>;
    isAvailable(roomId: string, date: string): Promise<boolean>;
    set(
      roomId: string,
      date: string,
      isAvailable: boolean
    ): Promise<{ date: string; isAvailable: boolean }>;
  };
}
