import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import InteractiveButton from "../../components/InteractiveButton";

// Update validation schema
const schema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register: registerUser } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("user");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    try {
      setSubmitLoading(true);
      await registerUser({
        ...data,
        role: selectedTab === "user" ? "user" : "owner",
      });
      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
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
          <h1 className="text-4xl font-medium mb-2">Create an account</h1>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Custom tabs using Tailwind */}
        <div className="flex rounded-xl bg-primary-100 p-1">
          <button
            type="button"
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
            type="button"
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
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="First Name"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.first_name ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Last Name"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.last_name ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          {selectedTab === "owner" && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Business Name (Optional)"
                className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register("business_name")}
              />
            </div>
          )}
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`w-full p-3 rounded-lg bg-gray-100 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-primary-500 hover:underline">
                Terms & Conditions
              </Link>
            </label>
          </div>

          <InteractiveButton
            className="w-full"
            type="submit"
            variant="primary"
            isLoading={submitLoading}
          >
            Create account
          </InteractiveButton>
        </form>
      </div>
    </div>
  );
}
