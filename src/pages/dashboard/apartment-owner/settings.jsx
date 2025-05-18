import { useState, useEffect, forwardRef } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCamera,
  FiLock,
  FiShield,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { uploadService } from "../../../services/api";
import InteractiveButton from "../../../components/InteractiveButton";
import { getGreeting } from "../../../utils/helpers";
import clsx from "clsx";

const InputField = forwardRef(
  ({ label, icon: Icon, error, disabled, ...props }, ref) => {
    return (
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <span>{label}</span>
        </label>
        <input
          {...props}
          ref={ref}
          disabled={disabled}
          className={clsx(
            "block w-full px-4 py-2.5 text-gray-700 bg-white border rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            {
              "border-gray-300": !error,
              "border-red-500 ring-2 ring-red-500/20": error,
            }
          )}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

// Add display name for better debugging
InputField.displayName = "InputField";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [greeting, setGreeting] = useState(getGreeting());
  const { user, updateProfile, changePassword } = useAuth();

  useEffect(() => {
    // Update greeting every minute
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(intervalId);
  }, []);

  console.log(user);
  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue,
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      business_name: user?.business_name || "",
      photo: user?.photo?.url || null,
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // Watch new password for confirmation validation
  const newPassword = watch("new_password");

  useEffect(() => {
    if (user) {
      resetProfile({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        business_name: user.business_name || "",
        photo: user.photo || "",
      });
      setImagePreview(user.photo?.url);
    }
  }, [user, resetProfile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Store the file for later upload
      setValue("photo", file);
    }
  };

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      let photoUrl = data.photo;

      // Check if photo is a File object (new upload) rather than a string (existing URL)
      if (data.photo instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("image", data.photo);
        const uploadResponse = await uploadService.uploadImage(imageFormData);
        photoUrl = uploadResponse.data;
      }

      // Remove email from payload
      const { email, ...profileData } = data;

      const profileResponse = await updateProfile({
        ...profileData,
        photo: photoUrl,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.new_password !== data.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.put("/api/users/change-password", {
        currentPassword: data.current_password,
        newPassword: data.new_password,
      });
      toast.success("Password updated successfully");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {greeting}, {user?.first_name || "there"}!
        </h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`${
              activeTab === "profile"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FiUser className="mr-2" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`${
              activeTab === "password"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FiLock className="mr-2" />
            Change Password
          </button>
          <button
            onClick={() =>
              (window.location.href = `/${user?.role}/settings/kyc`)
            }
            className={`${
              activeTab === "kyc"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FiShield className="mr-2" />
            KYC Verification
          </button>
        </nav>
      </div>

      {/* Profile Tab Content */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="space-y-8"
        >
          {/* Profile Photo */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={imagePreview || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <FiCamera className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  id="photo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              icon={FiUser}
              {...registerProfile("first_name", {
                required: "First name is required",
              })}
              error={profileErrors.first_name?.message}
              placeholder="Enter your first name"
            />

            <InputField
              label="Last Name"
              icon={FiUser}
              {...registerProfile("last_name", {
                required: "Last name is required",
              })}
              error={profileErrors.last_name?.message}
              placeholder="Enter your last name"
            />

            <InputField
              label="Email"
              icon={FiMail}
              {...registerProfile("email")}
              type="email"
              disabled
              placeholder="Your email address"
            />

            <InputField
              label="Phone Number"
              icon={FiPhone}
              {...registerProfile("phone_number")}
              type="tel"
              placeholder="Enter your phone number"
            />

            <div className="md:col-span-2">
              <InputField
                label="Business Name"
                icon={FiBriefcase}
                {...registerProfile("business_name")}
                placeholder="Enter your business name"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <InteractiveButton
              type="submit"
              isLoading={loading}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Saving..." : "Save Changes"}
            </InteractiveButton>
          </div>
        </form>
      )}

      {/* Password Tab Content */}
      {activeTab === "password" && (
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-6 max-w-md"
        >
          <div className="space-y-6">
            <InputField
              label="Current Password"
              icon={FiLock}
              type="password"
              {...registerPassword("current_password", {
                required: "Current password is required",
              })}
              error={passwordErrors.current_password?.message}
              placeholder="Enter your current password"
            />

            <InputField
              label="New Password"
              icon={FiLock}
              type="password"
              {...registerPassword("new_password", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={passwordErrors.new_password?.message}
              placeholder="Enter your new password"
            />

            <InputField
              label="Confirm New Password"
              icon={FiLock}
              type="password"
              {...registerPassword("confirm_password", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "The passwords do not match",
              })}
              error={passwordErrors.confirm_password?.message}
              placeholder="Confirm your new password"
            />
          </div>

          <div className="flex justify-end pt-4">
            <InteractiveButton
              type="submit"
              isLoading={loading}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Updating..." : "Update Password"}
            </InteractiveButton>
          </div>
        </form>
      )}
    </div>
  );
}
