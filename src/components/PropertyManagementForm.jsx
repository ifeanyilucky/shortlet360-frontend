import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { formService } from '../services/api';
import CustomInput from './CustomInput';
import InteractiveButton from './InteractiveButton';
import PropertyManagementSuccess from './PropertyManagementSuccess';
import { FiHome, FiUser, FiPhone, FiMail, FiMapPin, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  propertyType: yup.string().required('Property type is required'),
  numberOfProperties: yup.number()
    .positive('Number must be positive')
    .integer('Number must be a whole number')
    .required('Number of properties is required'),
  address: yup.object().shape({
    street: yup.string().required('Street address is required'),
    area: yup.string().required('Area is required'),
    localGovernment: yup.string().required('Local Government is required'),
    state: yup.string().required('State is required'),
  }),
  agreeToFee: yup.boolean().oneOf([true], 'You must agree to the 5% management fee'),
});

const PropertyManagementForm = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const propertyTypes = [
    'Apartment',
    'House',
    'Duplex',
    'Bungalow',
    'Flat',
    'Studio',
    'Penthouse',
    'Townhouse',
    'Villa',
    'Other',
  ];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
    'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
    'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await formService.submitPropertyManagementForm(data);
      setApplicationData(response.data);
      setIsSubmitted(true);
      toast.success('Property management application submitted successfully!');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <PropertyManagementSuccess
        onClose={onClose}
        applicationData={applicationData}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-elevated">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Property Management Application
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our property management program and let Aplet360 handle your properties 
          with professional care while you enjoy steady returns.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiUser className="text-primary-600" />
            Personal Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <CustomInput
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              {...register('fullName')}
              error={errors.fullName?.message}
              icon={<FiUser />}
            />
            
            <CustomInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              error={errors.email?.message}
              icon={<FiMail />}
            />
            
            <CustomInput
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
              icon={<FiPhone />}
            />
          </div>
        </div>

        {/* Property Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiHome className="text-primary-600" />
            Property Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                {...register('propertyType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.propertyType && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
              )}
            </div>

            <CustomInput
              label="Number of Properties"
              type="number"
              placeholder="How many properties?"
              {...register('numberOfProperties')}
              error={errors.numberOfProperties?.message}
              icon={<FiHome />}
              min="1"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FiMapPin className="text-primary-600" />
            Property Address
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <CustomInput
              label="Street Address"
              type="text"
              placeholder="Enter street address"
              {...register('address.street')}
              error={errors.address?.street?.message}
              icon={<FiMapPin />}
            />

            <CustomInput
              label="Area"
              type="text"
              placeholder="Enter area/district"
              {...register('address.area')}
              error={errors.address?.area?.message}
              icon={<FiMapPin />}
            />

            <CustomInput
              label="Local Government"
              type="text"
              placeholder="Enter local government"
              {...register('address.localGovernment')}
              error={errors.address?.localGovernment?.message}
              icon={<FiMapPin />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                {...register('address.state')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select state</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.address?.state && (
                <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Management Fee Agreement */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiDollarSign className="text-yellow-600" />
            Management Fee Agreement
          </h3>

          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2">5% Management Fee</h4>
              <p className="text-gray-700 text-sm mb-4">
                Aplet360 charges a competitive 5% management fee on all rental income generated
                from your properties. This fee covers:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tenant screening and management</li>
                <li>• Rent collection and financial reporting</li>
                <li>• Property maintenance coordination</li>
                <li>• Marketing and leasing services</li>
                <li>• Legal compliance and documentation</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              {...register('agreeToFee')}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              I agree to the 5% management fee on all rental income generated from my properties
              under Aplet360's management. I understand this fee will be automatically deducted
              from rental payments before disbursement.
            </label>
          </div>
          {errors.agreeToFee && (
            <p className="text-red-500 text-sm mt-2">{errors.agreeToFee.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <InteractiveButton
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="px-8 py-3"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </InteractiveButton>
        </div>
      </form>
    </div>
  );
};

export default PropertyManagementForm;
