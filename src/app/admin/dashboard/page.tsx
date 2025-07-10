"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { getAdminDashboardQuery } from "@/utils/queries";

import {
  Users,
  Hotel,
  CalendarCheck,
  Wallet,
  Building2,
  BedDouble,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import { DashboardCard } from "@/components/dashboard";
import { ActionCard } from "@/components/actionCard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    hotels: 0,
    bookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const res = await axiosClient.post("", {
          query: getAdminDashboardQuery,
        });

        const { users, hotels, bookings } = res.data.data;

        const revenue = bookings.reduce((total: number, booking: any) => {
          const checkIn = new Date(booking.checkIn);
          const checkOut = new Date(booking.checkOut);
          const nights =
            Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
            ) || 1;
          return total + nights * booking.room.price;
        }, 0);

        setStats({
          users: users.length,
          hotels: hotels.length,
          bookings: bookings.length,
          revenue,
        });
      } catch (err) {
        alert("Failed to load dashboard" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading)
    return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Total Users"
            value={stats.users}
            icon={<Users className="w-6 h-6" />}
          />
          <DashboardCard
            title="Hotels"
            value={stats.hotels}
            icon={<Building2 className="w-6 h-6" />}
          />
          <DashboardCard
            title="Bookings"
            value={stats.bookings}
            icon={<CalendarCheck className="w-6 h-6" />}
          />
          <DashboardCard
            title="Revenue"
            value={`₹${stats.revenue.toLocaleString()}`}
            icon={<Wallet className="w-6 h-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <ActionCard
              title="Manage Hotels"
              href="/admin/hotels"
              icon={<Hotel className="w-6 h-6" />}
            />
            <ActionCard
              title="Manage Rooms"
              href="/admin/rooms"
              icon={<BedDouble className="w-6 h-6" />}
            />
            <ActionCard
              title="View Bookings"
              href="/admin/bookings"
              icon={<ClipboardList className="w-6 h-6" />}
            />
            <ActionCard
              title="Add Hotel"
              href="/admin/hotels/add"
              icon={<PlusCircle className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
