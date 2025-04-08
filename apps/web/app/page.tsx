"use client";
import { RiLockPasswordFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "./components/header";
import Footer from "./components/footer";
import Link from "next/link";

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginSignup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/admin/login",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      const { token } = response.data;

      // Store the JWT token in local storage
      localStorage.clear();


      localStorage.setItem("token", token);
      alert("Login successful!");

      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row justify-center lg:justify-evenly py-3 mb-8">
        <div className="flex items-center justify-center px-4 w-full">
          <div className="bg-white p-8 border border-gray-600 shadow-lg rounded w-full max-w-lg mod:w-[24rem] lg:max-w-sm mt-6 lg:mt-5 mb-24 lg:mb-32">
            <h1 className="text-3xl text-black-300 font-normal text-center mb-6">
              Login & Signup
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="block font-normal text-gray-700"
                >
                  Email:
                </label>
                <div>
                  <input
                    type="text"
                    id="email"
                    placeholder="Email "
                    {...register("email")}
                    className={`w-full  p-2 border border-gray-600 rounded mt-1 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-normal text-gray-700 mt-4"
                >
                  Password:
                </label>
                <div className="relative">
                  <RiLockPasswordFill className="absolute left-2 top-4 text-gray-700" />
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    {...register("password")}
                    className={`w-full pl-8 p-2 border border-gray-600 rounded mt-1 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-400 focus:outline-none"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="font-normal">Create an Account &nbsp; </span>
              <Link
                href="/admin/signup"
                className="hover:underline font-semibold text-blue-600"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
