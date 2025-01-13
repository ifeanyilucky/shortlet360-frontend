import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InteractiveButton from "../../components/InteractiveButton";
import { authService } from "../../services/api";
import { set } from "lodash";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [submitLoading, setSubmitLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      username: user?.username || "",
      displayName: user?.displayName || "",
      about: user?.about || "",
      location: user?.location || "",
      websiteUrl: user?.websiteUrl || "",
      instagram: user?.socialLinks?.instagram || "",
      facebook: user?.socialLinks?.facebook || "",
      twitter: user?.socialLinks?.twitter || "",
      youtube: user?.socialLinks?.youtube || "",
    },
  });

  const watchedFields = watch();
  // console.log(user);
  const onSubmit = async (data) => {
    setSubmitLoading(true);
    await updateProfile({
      about: data.about,
      socialLinks: {
        instagram: data.instagram,
        facebook: data.facebook,
        twitter: data.twitter,
        youtube: data.youtube,
      },
      displayName: data.displayName,
      location: data.location,
      websiteUrl: data.websiteUrl,
    })
      .then((res) => {
        toast.success("Profile updated successfully");
        setSubmitLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSubmitLoading(false);
        if (err?.response?.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon name="ph:arrow-left" size={24} />
          </button>
          <h1 className=" font-semibold">EDIT PROFILE</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Cover Image */}
        <div className="relative h-48 bg-gray-200 rounded flex items-center justify-center">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" />
            <div className="p-2 bg-black/50 rounded-full text-white">
              <Icon
                name="ph:camera-light"
                fontSize={24}
                className="text-white"
              />
            </div>
          </label>
        </div>

        {/* Profile Image */}
        <div className="relative mb-16">
          <div className="absolute -bottom-12 left-4">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 border-4 border-white rounded-full bg-gray-200 flex items-center justify-center">
                  <Icon fontSize={40} icon="ph:user" className="text-white" />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <input type="file" accept="image/*" className="hidden" />
                <Icon
                  icon="ph:camera-light"
                  fontSize={30}
                  className="text-white"
                />
              </label>
            </div>
            {/* <div className="relative w-24 h-24 rounded-full border-4 border-white bg-gray-200">
              <img
                src="/path-to-profile-image.jpg"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div> */}
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-4 py-8 space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              name="username"
              {...register("username")}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                name="displayName"
                {...register("displayName")}
                placeholder="Display name"
                maxLength={40}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                {watchedFields.displayName?.length || 0}/40
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <textarea
                name="about"
                {...register("about")}
                placeholder="about"
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                {watchedFields.about?.length || 0}/1000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                name="location"
                {...register("location")}
                placeholder="Location"
                maxLength={64}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                {watchedFields.location?.length || 0}/64
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="url"
                name="websiteUrl"
                {...register("websiteUrl")}
                placeholder="Website URL"
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                {watchedFields.websiteUrl?.length || 0}/100
              </span>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Social links</h2>

            {/* Instagram */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <Icon icon="mdi:instagram" className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-gray-400">@</span>
                  <input
                    type="text"
                    {...register("instagram")}
                    placeholder="Enter instagram username"
                    className="flex-1 px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Facebook */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Icon icon="mdi:facebook" className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-gray-400">@</span>
                  <input
                    type="text"
                    {...register("facebook")}
                    placeholder="Enter facebook username"
                    className="flex-1 px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <Icon icon="mdi:twitter" className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-gray-400">@</span>
                  <input
                    type="text"
                    {...register("twitter")}
                    placeholder="Enter twitter username"
                    className="flex-1 px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Icon icon="mdi:youtube" className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-gray-400">@</span>
                  <input
                    type="text"
                    {...register("youtube")}
                    placeholder="Enter youtube username"
                    className="flex-1 px-2 py-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <InteractiveButton
            isLoading={submitLoading}
            className=""
            type="submit"
            variant="primary"
          >
            Update
          </InteractiveButton>
        </div>
      </form>
    </div>
  );
}
