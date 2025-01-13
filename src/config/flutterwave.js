import PropTypes from "prop-types";

export const flutterwaveConfig = (config) => {
  return {
    public_key: "FLWPUBK_TEST-bda917bfc5791e72ec69d2cd86177432-X",
    tx_ref: Date.now(),
    amount: config.amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: config.email,
      phone_number: "09071499826",
      name: config.displayName,
    },
    customizations: {
      title: "my Payment Title",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };
};
