import { useEffect, useState } from "react";
import { propertyStore } from "../store/propertyStore";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { fCurrency } from "../utils/formatNumber";
import LoadingOverlay from "./LoadingOverlay";

export default function PropertyDetailsModal({ propertyId }) {
  const { getProperty, property, isLoading } = propertyStore();

  useEffect(() => {
    if (propertyId) {
      getProperty(propertyId);
    }
  }, [propertyId]);

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
        <h3 className="text-2xl font-semibold mb-2">
          {property?.property_name}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <IoLocationOutline className="w-5 h-5 mr-2" />
          <span>{`${property?.location.street_address}, ${property?.location.city}, ${property?.location.state}`}</span>
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
        <p className="text-lg font-semibold text-blue-900">
          {fCurrency(property?.pricing.per_day.base_price)} / night
        </p>
        <div className="mt-2 space-y-1 text-sm text-blue-800">
          <p>
            Cleaning fee: {fCurrency(property?.pricing.per_day.cleaning_fee)}
          </p>
          <p>
            Security deposit:{" "}
            {fCurrency(property?.pricing.per_day.security_deposit)}
          </p>
        </div>
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
    </div>
  );
}
