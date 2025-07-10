"use client";

import { useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { useRouter } from "next/navigation";
import { loginQuery } from "@/utils/queries";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const res = await axiosClient.post("", {
        query: loginQuery,
        variables: { input: { email, password } },
      });

      const { data, errors } = res.data;
      if (errors) throw new Error(errors[0].message);

      const { token, user } = data.login;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }

    } catch (err: any) {
      alert(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
