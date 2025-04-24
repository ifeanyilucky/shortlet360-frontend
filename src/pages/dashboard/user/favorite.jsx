import { useEffect } from "react";
import { favoriteStore } from "../../../store/favoriteStore";
import { Link } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { AiFillHeart } from "react-icons/ai";
import { fCurrency } from "@utils/formatNumber";

export default function Favorite() {
  const { favorites, getFavorites, removeFromFavorites, isLoading } =
    favoriteStore();

  useEffect(() => {
    getFavorites();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            You haven't added any properties to your favorites yet.
          </p>
          <Link
            to="/book-now"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link to={`/property/${property._id}`}>
                <div className="h-64 overflow-hidden">
                  <img
                    src={
                      property.property_images?.[0]?.url ||
                      "/images/living-room.jpg"
                    }
                    alt={property.property_name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-xl">
                    {property.property_name}
                  </h3>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <IoLocationOutline className="w-4 h-4 mr-1" />
                  <span className="text-sm">{`${property.location.city}, ${property.location.state}`}</span>
                </div>

                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <BiBed className="w-5 h-5 mr-1" />
                    <span className="text-sm">
                      {property.bedroom_count} bed(s)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BiBath className="w-5 h-5 mr-1" />
                    <span className="text-sm">
                      {property.bathroom_count} bath(s)
                    </span>
                  </div>
                  <div className="flex items-center">
                    <HiOutlineUsers className="w-5 h-5 mr-1" />
                    <span className="text-sm">
                      {property.max_guests} guests
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xl">
                      {fCurrency(property.pricing.per_day.base_price)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {property.pricing.per_day.is_active ? "Per Day" : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromFavorites(property._id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <AiFillHeart className="w-6 h-6 text-red-500" />
                    </button>
                    <Link
                      to={`/property/${property._id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
