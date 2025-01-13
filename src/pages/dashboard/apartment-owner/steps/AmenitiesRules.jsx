import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export default function AmenitiesRules({ formData, setFormData }) {
    const [newAmenity, setNewAmenity] = useState('');
    const [newRule, setNewRule] = useState('');

    const commonAmenities = [
        'WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Washing Machine',
        'Free Parking', 'Pool', 'Hot Tub', 'Gym', 'Elevator',
        'Security Cameras', '24/7 Security', 'Balcony', 'Garden View'
    ];

    const handleAddAmenity = () => {
        if (newAmenity && !formData.amenities.includes(newAmenity)) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity]
            }));
            setNewAmenity('');
        }
    };

    const handleAddRule = () => {
        if (newRule && !formData.house_rules.includes(newRule)) {
            setFormData(prev => ({
                ...prev,
                house_rules: [...prev.house_rules, newRule]
            }));
            setNewRule('');
        }
    };

    const removeAmenity = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenity)
        }));
    };

    const removeRule = (rule) => {
        setFormData(prev => ({
            ...prev,
            house_rules: prev.house_rules.filter(r => r !== rule)
        }));
    };

    return (
        <div className="space-y-8">
            {/* Amenities Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {commonAmenities.map(amenity => (
                        <button
                            key={amenity}
                            onClick={() => !formData.amenities.includes(amenity) &&
                                setFormData(prev => ({
                                    ...prev,
                                    amenities: [...prev.amenities, amenity]
                                }))}
                            className={`p-2 text-sm rounded-md text-left ${formData.amenities.includes(amenity)
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder="Add custom amenity"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddAmenity}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    >
                        <FiPlus className="mr-1" /> Add
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {formData.amenities.map(amenity => (
                        <span
                            key={amenity}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                            {amenity}
                            <button
                                onClick={() => removeAmenity(amenity)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <FiX />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* House Rules Section */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">House Rules</h3>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        placeholder="Add a house rule"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddRule}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    >
                        <FiPlus className="mr-1" /> Add
                    </button>
                </div>

                <div className="space-y-2">
                    {formData.house_rules.map(rule => (
                        <div
                            key={rule}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                            <span>{rule}</span>
                            <button
                                onClick={() => removeRule(rule)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 