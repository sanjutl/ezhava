import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CheckoutForm.css'
import baseUrl from "../../baseUrl"
const CheckoutForm = ({ userId, profileId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  console.log("ninta", userId, profileId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}:3000/payment-success/${profileId}?userId=${userId}`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Payment successful!");

    }

    setIsLoading(false);
  };

  

  return (
    <div className="checkout-main-container">
      <form onSubmit={handleSubmit} className='checkout-main-container-form' >
        <PaymentElement />
        <div className="button-container-checkout">
          <button disabled={isLoading || !stripe || !elements} className='checkout-main-container-button'>
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

const CheckoutWrapper = ({ userId, profileId, stripePromise }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent when component mounts
    axios.post(`${baseUrl}/api/v1/user/create-payment-intent/${userId}/${profileId}`)
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to create payment intent.');
      });
  }, [userId, profileId]);

  // Only render the Elements when clientSecret is available
  if (!clientSecret) {
    return <div>Loading...</div>; // Handle case where clientSecret is not set yet
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm userId={userId} profileId={profileId} />
      <ToastContainer />
    </Elements>
  );
};

export default CheckoutWrapper;