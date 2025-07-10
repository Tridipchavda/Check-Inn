"use client";

import { useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { useRouter } from "next/navigation";
import { registerQuery } from "@/utils/queries";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
    setLoading(true);

    try {
      const res = await axiosClient.post("", {
        query: registerQuery,
        variables: { input: { name, email, password } },
      });

      const { data, errors } = res.data;
      if (errors) {
        console.log(errors)
        throw new Error(errors[0].message);
      }

      localStorage.setItem("token", data.register.token);
      router.replace("/login");
    } catch (err: any) {
      alert(err.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 px-4 py-10">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Your Account
        </h2>

        <div>
          <label
            htmlFor="name"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
