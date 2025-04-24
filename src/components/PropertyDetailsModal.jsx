import { useEffect, useState } from "react";
import { propertyStore } from "../store/propertyStore";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import {
  BsShare,
  BsTwitterX,
  BsWhatsapp,
  BsFacebook,
  BsLinkedin,
} from "react-icons/bs";
import { fCurrency } from "../utils/formatNumber";
import LoadingOverlay from "./LoadingOverlay";
import AvailabilityCalendar from "./AvailabilityCalendar";
import toast from "react-hot-toast";

export default function PropertyDetailsModal({ propertyId }) {
  const { getProperty, property, isLoading } = propertyStore();

  useEffect(() => {
    if (propertyId) {
      getProperty(propertyId);
    }
  }, [propertyId]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/property/${propertyId}`;
    const shareTitle = property?.property_name;
    const shareText = `Check out this amazing property: ${property?.property_name} in ${property?.location.city}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const handleSocialShare = (platform) => {
    const shareUrl = `${window.location.origin}/property/${propertyId}`;
    const shareTitle = encodeURIComponent(property?.property_name || "");
    const shareText = encodeURIComponent(
      `Check out this amazing property: ${property?.property_name} in ${property?.location.city}`
    );

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  if (isLoading) return <LoadingOverlay />;
  if (!property) return null;

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="aspect-video rounded-2xl overflow-hidden">
        <img
          src={property?.property_images[0]?.url || "/images/living-room.jpg"}
          alt={property?.property_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Basic Info */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              {property?.property_name}
            </h3>
            <div className="flex items-center text-gray-600">
              <IoLocationOutline className="w-5 h-5 mr-2" />
              <span>{`${property?.location.street_address}, ${property?.location.city}, ${property?.location.state}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
            >
              <BsShare className="w-4 h-4" />
              <span>Share</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleSocialShare("twitter")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on Twitter"
              >
                <BsTwitterX className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare("facebook")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on Facebook"
              >
                <BsFacebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare("whatsapp")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on WhatsApp"
              >
                <BsWhatsapp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare("linkedin")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on LinkedIn"
              >
                <BsLinkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <BiBed className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-semibold">{property?.bedroom_count}</p>
              <p className="text-sm text-gray-500">Bedrooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BiBath className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-semibold">{property?.bathroom_count}</p>
              <p className="text-sm text-gray-500">Bathrooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineUsers className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-semibold">{property?.max_guests}</p>
              <p className="text-sm text-gray-500">Max Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="p-4 bg-blue-50 rounded-xl">
        {property?.pricing.rent_per_year.is_active && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-blue-900">
              {fCurrency(property?.pricing.rent_per_year.annual_rent)} / year
            </p>
            <div className="mt-2 space-y-1 text-sm text-blue-800">
              {property?.pricing.rent_per_year.is_agency_fee_active && (
                <p>
                  Agency Fee:{" "}
                  {fCurrency(property?.pricing.rent_per_year.agency_fee)}
                </p>
              )}
              {property?.pricing.rent_per_year.is_commission_fee_active && (
                <p>
                  Commission Fee:{" "}
                  {fCurrency(property?.pricing.rent_per_year.commission_fee)}
                </p>
              )}
              {property?.pricing.rent_per_year.is_caution_fee_active && (
                <p>
                  Caution Fee:{" "}
                  {fCurrency(property?.pricing.rent_per_year.caution_fee)}
                </p>
              )}
              {property?.pricing.rent_per_year.is_legal_fee_active && (
                <p>
                  Legal Fee:{" "}
                  {fCurrency(property?.pricing.rent_per_year.legal_fee)}
                </p>
              )}
            </div>
          </div>
        )}

        {property?.pricing.per_day.is_active && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-blue-900">
              {fCurrency(property?.pricing.per_day.base_price)} / night
            </p>
            <div className="mt-2 space-y-1 text-sm text-blue-800">
              <p>
                Cleaning fee:{" "}
                {fCurrency(property?.pricing.per_day.cleaning_fee)}
              </p>
              <p>
                Security deposit:{" "}
                {fCurrency(property?.pricing.per_day.security_deposit)}
              </p>
            </div>
          </div>
        )}

        {property?.pricing.per_week.is_active && (
          <div className="mb-4">
            <p className="text-lg font-semibold text-blue-900">
              {fCurrency(property?.pricing.per_week.base_price)} / week
            </p>
            <div className="mt-2 space-y-1 text-sm text-blue-800">
              <p>
                Cleaning fee:{" "}
                {fCurrency(property?.pricing.per_week.cleaning_fee)}
              </p>
              <p>
                Security deposit:{" "}
                {fCurrency(property?.pricing.per_week.security_deposit)}
              </p>
            </div>
          </div>
        )}

        {property?.pricing.per_month.is_active && (
          <div>
            <p className="text-lg font-semibold text-blue-900">
              {fCurrency(property?.pricing.per_month.base_price)} / month
            </p>
            <div className="mt-2 space-y-1 text-sm text-blue-800">
              <p>
                Cleaning fee:{" "}
                {fCurrency(property?.pricing.per_month.cleaning_fee)}
              </p>
              <p>
                Security deposit:{" "}
                {fCurrency(property?.pricing.per_month.security_deposit)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <h4 className="text-lg font-semibold mb-2">About this place</h4>
        <p className="text-gray-600">{property?.property_description}</p>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Amenities</h4>
        <div className="grid grid-cols-2 gap-3">
          {property?.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-600">
              <span>•</span>
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>
      <AvailabilityCalendar propertyId={propertyId} isOwner={true} />
    </div>
  );
}
