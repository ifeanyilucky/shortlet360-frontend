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
  BsChevronLeft,
  BsChevronRight,
  BsX,
} from "react-icons/bs";
import { fCurrency } from "../utils/formatNumber";
import LoadingOverlay from "./LoadingOverlay";
import AvailabilityCalendar from "./AvailabilityCalendar";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PropertyDetailsModal({ propertyId }) {
  const { getProperty, property, isLoading } = propertyStore();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);

  useEffect(() => {
    if (propertyId) {
      getProperty(propertyId);
    }
  }, [propertyId]);

  const openFullScreen = (index) => {
    setFullScreenIndex(index);
    setIsFullScreen(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    document.body.style.overflow = "unset";
  };

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
      {/* Media Gallery */}
      <div className="space-y-4">
        {(() => {
          // Combine images and videos into a single media array
          const allMedia = [
            ...(property?.property_images || []).map((img) => ({
              ...img,
              type: "image",
            })),
            ...(property?.property_videos || []).map((vid) => ({
              ...vid,
              type: "video",
            })),
          ];

          if (allMedia.length === 0) {
            return (
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No media available</span>
              </div>
            );
          }

          return (
            <>
              {/* Main Media Item */}
              <div
                className="aspect-video rounded-2xl overflow-hidden relative cursor-pointer group"
                onClick={() => openFullScreen(0)}
              >
                {allMedia[0]?.type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={allMedia[0]?.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      VIDEO
                    </div>
                  </div>
                ) : (
                  <img
                    src={allMedia[0]?.url || "/images/living-room.jpg"}
                    alt={property?.property_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Media Thumbnails */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allMedia.slice(1, 5).map((media, index) => (
                    <div
                      key={media._id || index}
                      className="aspect-square rounded-lg overflow-hidden relative cursor-pointer group"
                      onClick={() => openFullScreen(index + 1)}
                    >
                      {media.type === "video" ? (
                        <div className="relative w-full h-full">
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                            VID
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      {index === 3 && allMedia.length > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            +{allMedia.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}
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

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-hidden">
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-white z-[60] p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <BsX className="w-8 h-8" />
          </button>
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full max-w-[1000px] mx-auto px-4 relative !mt-0">
              {/* Custom navigation buttons */}
              <button className="swiper-button-prev absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[55] bg-white/10 hover:bg-white/20 transition-colors p-2 sm:p-3 rounded-full">
                <BsChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              <button className="swiper-button-next absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[55] bg-white/10 hover:bg-white/20 transition-colors p-2 sm:p-3 rounded-full">
                <BsChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="w-full h-full"
                initialSlide={fullScreenIndex}
              >
                {(() => {
                  // Combine all media for fullscreen view
                  const allMedia = [
                    ...(property?.property_images || []).map((img) => ({
                      ...img,
                      type: "image",
                    })),
                    ...(property?.property_videos || []).map((vid) => ({
                      ...vid,
                      type: "video",
                    })),
                  ];

                  return allMedia.map((media, index) => (
                    <SwiperSlide
                      key={media._id || index}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="flex items-center justify-center w-full h-full px-2 sm:px-4">
                        {media.type === "video" ? (
                          <div className="relative max-h-[85vh] max-w-full w-auto h-auto">
                            <video
                              src={media.url}
                              className="max-h-[85vh] max-w-full w-auto h-auto object-contain mx-auto shadow-xl"
                              controls
                              autoPlay
                              muted
                              loop
                              onError={(e) => {
                                console.error("Video playback error:", e);
                              }}
                            />
                            <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                              VIDEO
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media.url}
                            alt={`Gallery ${index + 1}`}
                            className="max-h-[85vh] max-w-full w-auto h-auto object-contain mx-auto shadow-xl"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ));
                })()}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
