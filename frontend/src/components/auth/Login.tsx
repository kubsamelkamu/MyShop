import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { PulseLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setMessage(null);
    try {
      const response = await api.post("/auth/login", data);
      const { token, user, message: responseMessage } = response.data;
      localStorage.setItem("token", token); 
      dispatch(setCredentials({ token, user }));

      setMessage(responseMessage || "Login successful!");
      
      setTimeout(() => {
        if (user.isAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1500);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-start bg-cover bg-center bg-no-repeat relative px-4"
      style={{ backgroundImage: "url('/bg_image.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative bg-blue-150 p-8 rounded-lg shadow-lg w-full max-w-md ml-16 z-10">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h1>

        {message && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-100 p-2 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email Address</label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-lg transition duration-300 flex justify-center items-center"
          >
            {isSubmitting ? <PulseLoader color="#fff" size={8} /> : "Log In"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
