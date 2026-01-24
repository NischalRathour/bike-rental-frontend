import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "../api/axiosConfig";

// Stripe publishable key
const stripePromise = loadStripe("YOUR_STRIPE_PUBLISHABLE_KEY");

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create Payment Intent on backend
      const { data } = await axios.post("/bookings/create-payment-intent", {
        amount: amount * 100, // amount in cents
      });

      const clientSecret = data.clientSecret;

      // 2️⃣ Confirm Card Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment successful! ✅");
        // You can now mark booking as paid in your DB
      }
    } catch (err) {
      console.error(err);
      setMessage("Payment failed!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "0 auto" }}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || loading} style={{ marginTop: "20px" }}>
        {loading ? "Processing..." : `Pay Rs. ${amount}`}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

const Payment = ({ amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
};

export default Payment;
