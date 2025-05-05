import PropTypes from "prop-types";

export const paystackConfig = (config) => {
  return {
    reference: new Date().getTime().toString(),
    email: config?.email,
    amount: config?.amount * 100, // Paystack amount is in kobo (multiply by 100)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // Replace with your actual Paystack public key
    metadata: {
      custom_fields: [
        {
          display_name: `${config?.first_name} ${config?.last_name}`,
          variable_name: "customer_name",
          value: config.first_name + " " + config.last_name,
        },
        {
          display_name: `${config._id}`,
          variable_name: "customer_id",
          value: config._id,
        },
      ],
    },
  };
};

paystackConfig.propTypes = {
  config: PropTypes.shape({
    email: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};
