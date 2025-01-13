import { useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "../../services/api";
import InteractiveButton from "../../components/InteractiveButton";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { changePassword } = useAuth();

  const schema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    password: Yup.string().required("New password is required"),
    confirmPassword: Yup.string()
      .required("Confirm new password")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),
  });
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
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.password,
      });
      toast.success("Password changed successfully!");
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Change password</h1>
      </div>
      <div className="mb-5 space-y-5">
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="text-sm text-gray-600">
            Current password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Enter current password"
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                errors.currentPassword ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-gray-600">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
          <label htmlFor="confirmPassword" className="text-sm text-gray-600">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
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
      </div>
      <InteractiveButton
        onClick={handleSubmit(onSubmit)}
        isLoading={submitLoading}
      >
        Change password
      </InteractiveButton>
    </div>
  );
}
