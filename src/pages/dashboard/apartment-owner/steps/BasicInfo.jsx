export default function BasicInfo({ formData, setFormData }) {
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value
            }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Property Details Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Name *
                        </label>
                        <input
                            type="text"
                            value={formData.property_name}
                            onChange={e => handleChange('property_name', e.target.value)}
                            placeholder="Enter property name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Description *
                        </label>
                        <textarea
                            value={formData.property_description}
                            onChange={e => handleChange('property_description', e.target.value)}
                            placeholder="Describe your property"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type *
                        </label>
                        <select
                            value={formData.property_type}
                            onChange={e => handleChange('property_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select property type</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="studio">Studio</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bedrooms *
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.bedroom_count}
                                onChange={e => handleChange('bedroom_count', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bathrooms *
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.bathroom_count}
                                onChange={e => handleChange('bathroom_count', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Guests *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.max_guests}
                                onChange={e => handleChange('max_guests', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address *
                        </label>
                        <input
                            type="text"
                            value={formData.location.street_address}
                            onChange={e => handleLocationChange('street_address', e.target.value)}
                            placeholder="Enter street address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                value={formData.location.city}
                                onChange={e => handleLocationChange('city', e.target.value)}
                                placeholder="Enter city"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                value={formData.location.state}
                                onChange={e => handleLocationChange('state', e.target.value)}
                                placeholder="Enter state"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                        </label>
                        <input
                            type="text"
                            value={formData.location.country}
                            onChange={e => handleLocationChange('country', e.target.value)}
                            placeholder="Enter country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 