"use client";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginSchema, LoginSchema} from "../../../lib/validation/loginSchema";
import axios from "../../../utils/axiosInstance";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useAuth} from "../../contexts/AuthContext";

export default function LoginPage() {
  const {login} = useAuth();
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true);
    setError("");

    const formats = [
      {username: data.identifier, password: data.password},
      {username: data.identifier, password: data.password},
      data.identifier.includes("@")
        ? {
            username: data.identifier.split("@")[0],
            password: data.password,
          }
        : null,
    ].filter(Boolean);

    for (const [index, loginData] of formats.entries()) {
      try {
        const res = await axios.post("/auth/login", loginData);
        const token = res.data.token;
        const role = res.data.role; // Get role from response
        const username =
          res.data.username || loginData?.username || data.identifier;

        if (!token) {
          throw new Error("No token received from server");
        }

        // Pass username and role to login function
        login(token, role, username);

        // Redirect based on role
        if (role === "Admin") {
          router.push("/admin/articles");
        } else {
          router.push("/articles");
        }

        return;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message;

        if (index === formats.length - 1) {
          setError(
            `All login formats failed. The server only accepts 'username' field. Make sure you're using the username you registered with, not email.`
          );
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            {...register("identifier")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your username (not email)"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">
              {errors.identifier.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Use the username you created during registration
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
            <p className="font-medium">Login Error:</p>
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
