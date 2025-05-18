import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import toast from "react-hot-toast";
import InteractiveButton from "../../../components/InteractiveButton";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    property_name: "",
    property_description: "",
    property_type: "",
    property_category: "",
    is_active: false,
    location: {
      street_address: "",
      city: "",
      state: "",
      country: "Nigeria",
      zip_code: "",
    },
    amenities: [],
    rules: [],
    max_guests: 1,
    bedrooms: 1,
    bathrooms: 1,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await adminService.getPropertyById(id);
        setProperty(res.data.property);

        // Initialize form data with property details
        const propertyData = res.data.property;
        setFormData({
          property_name: propertyData.property_name || "",
          property_description: propertyData.property_description || "",
          property_type: propertyData.property_type || "",
          property_category: propertyData.property_category || "",
          is_active: propertyData.is_active || false,
          location: {
            street_address: propertyData.location?.street_address || "",
            city: propertyData.location?.city || "",
            state: propertyData.location?.state || "",
            country: propertyData.location?.country || "Nigeria",
            zip_code: propertyData.location?.zip_code || "",
          },
          amenities: propertyData.amenities || [],
          rules: propertyData.rules || [],
          max_guests: propertyData.max_guests || 1,
          bedrooms: propertyData.bedrooms || 1,
          bathrooms: propertyData.bathrooms || 1,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch property details");
        navigate("/admin/properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.filter((amenity) => amenity !== value),
      }));
    }
  };

  const handleRulesChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        rules: prev.rules.filter((rule) => rule !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await adminService.updateProperty(id, formData);
      toast.success("Property updated successfully");
      navigate("/admin/properties");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
        <button
          onClick={() => navigate("/admin/properties")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back to Properties
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name
              </label>
              <input
                type="text"
                name="property_name"
                value={formData.property_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Description
              </label>
              <textarea
                name="property_description"
                value={formData.property_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="property_category"
                value={formData.property_category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="shortlet">Shortlet</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Status
              </label>
              <select
                name="publication_status"
                value={formData.publication_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="pending">Pending</option>
                <option value="published">Published</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Only published properties will be visible to users on the
                platform.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-700"
              >
                Active
              </label>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Location
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="location.street_address"
                value={formData.location.street_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                name="location.zip_code"
                value={formData.location.zip_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <InteractiveButton
            type="submit"
            isLoading={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </InteractiveButton>
        </div>
      </form>
    </div>
  );
}
