
# 🏨 Check-Inn — Hotel Booking System

Check-Inn is a full-stack hotel booking platform built with **Next.js**, **GraphQL**, and **PostgreSQL**. It allows users to browse hotels, book rooms, and manage their bookings. Admins can manage hotels, rooms, availability, and approve pending bookings.

---

## 🚀 Features

### ✅ User-Facing Functionality

- 🔍 **Hotel Search**  
  Users can search hotels by city and date, view hotel details, and check room availability.

- 🛏️ **Room Booking**  
  - Select available rooms
  - Input guest count and booking dates
  - Real-time cost summary
  - Book room directly with guest info

- ✍️ **Hotel Reviews**  
  Users can leave reviews with ratings and comments.

- 📆 **My Bookings Page**  
  - View all bookings with hotel info
  - Status indicators (`CONFIRMED`, `PENDING`, `CANCELLED`)
  - Cancel `PENDING` bookings
  - Responsive and consistent card UI

---

### 🛠️ Admin Functionality

- 📋 **Admin Dashboard**  
  View all bookings across all hotels with status tags.

- ✅ **Booking Approval**  
  - Approve `PENDING` bookings with a click
  - Real-time status updates
  - Displays hotel name and room type

- 🧠 **Smart Search**  
  - Search across hotel name, room type, or room number
  - Debounced 1-second live filtering (like PostgreSQL `ILIKE`)
  - Case-insensitive and partial match

---

## 🧪 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons  
- **Backend:** GraphQL API with raw SQL (`pg`), custom resolvers  
- **Database:** PostgreSQL  
- **Validation:** Zod schemas  
- **State Management:** React `useState` / `useEffect`

---

## 🔐 Auth & API

- JWT-based authentication
- `axiosClient` handles authorized GraphQL requests with `token`
- Admin and user role-based logic split into separate views

---

## 📂 Directory Structure (Simplified)

```
/src
  /app
    /book        → Page Preview for booking calculation
    /admin       → Admin dashboard + booking approvals
    /hotels      → Hotel detail & reviews
    /login       → Login for both admin and user
    /signup      → Signup Page
    /my-bookings → Show Bookings Info
```

---

## 🧰 Dev Setup

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev
```

> Make sure your `.env` includes DB and API credentials. According to `.env.sample`

---

## 📄 License

MIT — Feel free to fork, contribute, and build your own hotel booking engine.

---
