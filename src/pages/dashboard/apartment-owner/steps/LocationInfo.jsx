
export default function LocationInfo({ formData, setFormData }) {
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
    );
} 