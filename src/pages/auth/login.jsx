import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react/dist/iconify.js";
import AuthSocial from "../../components/auth/AuthSocial";
import InteractiveButton from "../../components/InteractiveButton";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Add validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { login } = useAuth();
  const [selectedTab, setSelectedTab] = useState("user");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      const response = await login({ ...data, userType: selectedTab });

      // The login function in JWTContext will handle redirection based on requiresPayment
      // We just need to show an appropriate message
      if (response?.requiresPayment) {
        toast.success(
          "Please complete your registration payment to activate your account"
        );
      } else {
        toast.success("Login successful");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error - Please check your internet connection");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-4xl font-medium mb-2">Login to your account</h1>
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-accent-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Custom tabs using Tailwind */}
        {/* <div className="flex rounded-xl bg-primary-100 p-1">
          <button
            className={`w-1/2 rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${
                selectedTab === "user"
                  ? "bg-primary-500 text-white shadow"
                  : "text-primary-500 hover:bg-primary-200"
              }`}
            onClick={() => setSelectedTab("user")}
          >
            Guest
          </button>
          <button
            className={`w-1/2 rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors
              ${
                selectedTab === "owner"
                  ? "bg-primary-500 text-white shadow"
                  : "text-primary-500 hover:bg-primary-200"
              }`}
            onClick={() => setSelectedTab("owner")}
          >
            Host
          </button>
        </div> */}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-accent-500`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-accent-500`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <InteractiveButton
            type="submit"
            variant="accent"
            isLoading={submitLoading}
            className="w-full py-3 text-base font-medium"
            size="large"
          >
            {submitLoading ? "Logging in..." : "Login"}
          </InteractiveButton>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or login with</span>
            </div>
          </div> */}

          {/* <AuthSocial /> */}
        </form>
      </div>
    </div>
  );
}
