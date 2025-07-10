import { Pool } from "pg";
import { JwtPayload } from "jsonwebtoken";
import { HotelInputSchema, UpdateHotelInputSchema } from "@/types/hotel";
import { AddRoomInputSchema, UpdateRoomInputSchema } from "@/types/room";
import { BookingInputSchema } from "@/types/booking";
import { ReviewInputSchema } from "@/types/review";
import { normalizeInputDates } from "./normalizeInput";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  query: async (text: string, params?: any[]) => {
    try {
      return await pool.query(text, params);
    } catch (err: any) {
      console.error("❌ DB Error:", {
        query: text,
        params,
        error: err.message,
      });

      throw new Error(
        process.env.NODE_ENV === "development"
          ? `Database error: ${err.message}`
          : "Internal server error during DB operation"
      );
    }
  },

  user: {
    async findById(id: string) {
      const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      return res.rows[0];
    },
    async findAll() {
      const res = await db.query("SELECT * FROM users");
      return res.rows;
    },
    async findByEmail(email: string) {
      const res = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return res.rows[0];
    },
    async findByName(name: string) {
      const res = await db.query("SELECT * FROM users WHERE name = $1", [name]);
      return res.rows[0];
    },
    async create({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) {
      const res = await db.query(
        `INSERT INTO users (id, name, email, password, role, createdAt)
         VALUES (gen_random_uuid(), $1, $2, $3, 'CUSTOMER', NOW())
         RETURNING *`,
        [name, email, password]
      );
      return res.rows[0];
    },
  },

  hotel: {
    async findAll(filter?: any) {
      let query = "SELECT * FROM hotels";
      const values: any[] = [];

      if (filter?.location) {
        values.push(filter.location);
        query += ` WHERE location = $${values.length}`;
      }

      const res = await db.query(query, values);
      return res.rows;
    },

    async findById(id: string) {
      const res = await db.query("SELECT * FROM hotels WHERE id = $1", [id]);
      return res.rows[0];
    },

    async findByFilter(filter?: {
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      amenities?: string[];
      minRating?: number;
      availableFrom?: string;
      availableTo?: string;
    }) {
      let query = `
        SELECT DISTINCT h.*
        FROM hotels h
        LEFT JOIN rooms r ON h.id = r."hotelId"
      `;

      const conditions: string[] = [];
      const values: any[] = [];

      // Basic hotel and room filters
      if (filter?.location) {
        values.push(filter.location);
        conditions.push(`h.location = $${values.length}`);
      }
      if (filter?.minPrice != null) {
        values.push(filter.minPrice);
        conditions.push(`r.price >= $${values.length}`);
      }
      if (filter?.maxPrice != null) {
        values.push(filter.maxPrice);
        conditions.push(`r.price <= $${values.length}`);
      }
      if (filter?.amenities?.length) {
        values.push(filter.amenities);
        conditions.push(`h.amenities && $${values.length}::text[]`);
      }
      if (filter?.minRating != null) {
        values.push(filter.minRating);
        conditions.push(`h.rating >= $${values.length}`);
      }

      // 🗓️ Availability date filtering
      if (filter?.availableFrom && filter?.availableTo) {
        query += `
          JOIN availability a ON a."roomId" = r.id
        `;
        values.push(filter.availableFrom);
        values.push(filter.availableTo);
        const fromIndex = values.length - 1;
        const toIndex = values.length;

        // Ensure all dates in range are available
        conditions.push(`
          r.id IN (
            SELECT a2."roomId"
            FROM availability a2
            WHERE a2.date BETWEEN $${fromIndex} AND $${toIndex}
              AND a2."isAvailable" = true
            GROUP BY a2."roomId"
            HAVING COUNT(*) >= ($${toIndex}::date - $${fromIndex}::date + 1)
          )
        `);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      query += ` ORDER BY h.rating DESC`;

      const res = await db.query(query, values);
      return res.rows;
    },

    async create(input: unknown) {
      const parsed = HotelInputSchema.parse(input);
      const { name, location, description, amenities, images } = parsed;

      const res = await db.query(
        `INSERT INTO hotels (id, name, location, description, amenities, images)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
         RETURNING *`,
        [name, location, description, amenities, images]
      );
      return res.rows[0];
    },

    async update(id: string, data: unknown) {
      const parsed = UpdateHotelInputSchema.parse(data);

      const fields = [];
      const values: any[] = [];

      if (parsed.name != null) {
        values.push(parsed.name);
        fields.push(`name = $${values.length}`);
      }
      if (parsed.location != null) {
        values.push(parsed.location);
        fields.push(`location = $${values.length}`);
      }
      if (parsed.description != null) {
        values.push(parsed.description);
        fields.push(`description = $${values.length}`);
      }
      if (parsed.amenities != null) {
        values.push(parsed.amenities);
        fields.push(`amenities = $${values.length}`);
      }
      if (parsed.images != null) {
        values.push(parsed.images);
        fields.push(`images = $${values.length}`);
      }

      values.push(id);
      const query = `UPDATE hotels SET ${fields.join(", ")} WHERE id = $${
        values.length
      } RETURNING *`;
      const res = await db.query(query, values);
      return res.rows[0];
    },

    async delete(id: string) {
      await db.query("DELETE FROM hotels WHERE id = $1", [id]);
      return true;
    },
  },

  room: {
    async findByHotel(hotelId: string) {
      const res = await db.query(`SELECT * FROM rooms WHERE "hotelId" = $1`, [
        hotelId,
      ]);
      return res.rows;
    },

    async findAll() {
      const res = await db.query(`
        SELECT 
          r.*, 
          h.name as hotel_name,
          h.location as hotel_location
        FROM rooms r
        JOIN hotels h ON h.id = r."hotelId"
      `);

      const rooms = res.rows.map((row) => ({
        ...row,
        hotel: {
          id: row.hotelId,
          name: row.hotel_name,
          location: row.hotel_location,
        },
      }));

      return rooms;
    },

    async hotel(room: any) {
      const res = await db.query("SELECT * FROM hotels WHERE id = $1", [
        room.hotelId,
      ]);
      return res.rows[0];
    },

    async availability(room: any) {
      const res = await db.query(
        `SELECT date, "isAvailable" FROM availability WHERE "roomId" = $1 ORDER BY date`,
        [room.id]
      );

      return res.rows.map((row) => ({
        date: row.date.toISOString().split("T")[0],
        isAvailable: row.isAvailable,
      }));
    },

    async add(input: unknown) {
      const parsed = AddRoomInputSchema.parse(input);
      const { hotelId, capacity, price, roomNumber, type } = parsed;

      console.log(hotelId, capacity, price, roomNumber, type, "-----");
      const res = await db.query(
        `INSERT INTO rooms (id, "hotelId", capacity, price, "roomNumber", type)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
         RETURNING *`,
        [hotelId, capacity, price, roomNumber, type]
      );

      return res.rows[0];
    },

    async update(id: string, data: unknown) {
      const parsed = UpdateRoomInputSchema.parse(data);

      const fields = [];
      const values: any[] = [];

      if (parsed.price != null) {
        values.push(parsed.price);
        fields.push(`price = $${values.length}`);
      }
      if (parsed.capacity != null) {
        values.push(parsed.capacity);
        fields.push(`capacity = $${values.length}`);
      }
      if (parsed.description != null) {
        values.push(parsed.description);
        fields.push(`description = $${values.length}`);
      }

      values.push(id);
      const query = `UPDATE rooms SET ${fields.join(", ")} WHERE id = $${
        values.length
      } RETURNING *`;
      const res = await db.query(query, values);
      return res.rows[0];
    },
  },

  booking: {
    async findByUser(userId: string) {
      const res = await db.query(`SELECT * FROM bookings WHERE "userId" = $1`, [
        userId,
      ]);
      return res.rows;
    },

    async approveBooking(id: string) {
      const res = await db.query(
        `UPDATE bookings SET status = 'CONFIRMED' WHERE id = $1 RETURNING *`,
        [id]
      );
      return res.rows[0];
    },

    async findByUserOrAdmin(user: JwtPayload) {
      if (user.role === "ADMIN") {
        const res = await db.query("SELECT * FROM bookings");
        return res.rows;
      }
      return db.booking.findByUser(user.id);
    },

    async create(userId: string, input: object) {
      console.log("Creating booking for user:", userId, "with input:", input);

      const parsed = BookingInputSchema.parse(normalizeInputDates(input));
      const { roomId, checkIn, checkOut, guests } = parsed;

      const res = await db.query(
        `INSERT INTO bookings (id, "userId", "roomId", "checkIn", "checkOut", guests, status, "createdAt")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'PENDING', NOW())
          RETURNING *`,
        [userId, roomId, checkIn, checkOut, guests]
      );

      return res.rows[0];
    },

    async cancel(id: string) {
      const res = await db.query(
        `UPDATE bookings SET status = 'CANCELLED' WHERE id = $1 RETURNING *`,
        [id]
      );
      return res.rows[0];
    },
  },

  review: {
    async create(input: unknown) {
      const parsed = ReviewInputSchema.parse(input);
      const { userId, hotelId, rating, comment } = parsed;

      // 🚫 Check if a review by this user already exists for the hotel
      const existing = await db.query(
        `SELECT 1 FROM reviews WHERE "userId" = $1 AND "hotelId" = $2`,
        [userId, hotelId]
      );

      if (existing.rows.length > 0) {
        throw new Error("You have already reviewed this hotel.");
      }

      // ✅ Insert new review
      const res = await db.query(
        `INSERT INTO reviews (id, "userId", "hotelId", rating, comment, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       RETURNING *`,
        [userId, hotelId, rating, comment]
      );

      return res.rows[0];
    },

    async findByHotel(hotelId: string) {
      const res = await db.query(`SELECT * FROM reviews WHERE "hotelId" = $1`, [
        hotelId,
      ]);
      return res.rows;
    },
  },

  availability: {
    async find(roomId: string) {
      const res = await db.query(
        `SELECT * FROM availability WHERE "roomId" = $1`,
        [roomId]
      );
      return res.rows;
    },

    async isAvailable(roomId: string, date: string) {
      const res = await db.query(
        `SELECT "isAvailable" FROM availability WHERE "roomId" = $1 AND date = $2`,
        [roomId, date]
      );
      return res.rows[0]?.isAvailable ?? false;
    },

    set: async (roomId: string, date: string, isAvailable: boolean) => {
      console.log(roomId, date, isAvailable);
      const res = await db.query(
        `
          INSERT INTO availability ("roomId", date, "isAvailable")
          VALUES ($1, $2, $3)
          ON CONFLICT ("roomId", date)
          DO UPDATE SET "isAvailable" = EXCLUDED."isAvailable"
          RETURNING *
        `,
        [roomId, date, isAvailable]
      );
      return res.rows[0];
    },
  },
};
