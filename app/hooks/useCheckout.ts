import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export function useCheckout() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      setStripe(stripe);
    }
    loadStripeAsync();
  }, []);

  const createPaymentCheckout = async (checkoutData: {
    priceId: string | undefined;
  }) => {
    if (!stripe) {
      throw new Error("Stripe is not initialized");
    }

    try {
      const response = await fetch("/api/stripe/create-payment-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();
      
      if (!data.sessionId) {
        throw new Error('No session ID received from server');
      }

      console.log('Redirecting to checkout with session ID:', data.sessionId);
      
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  }

  const createSubscriptionCheckout = async (checkoutData: {
    priceId: string | undefined;
  }) => {
    if (!stripe) {
      throw new Error("Stripe is not initialized");
    }

    try {
      const response = await fetch("/api/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();
      
      if (!data.sessionId) {
        throw new Error('No session ID received from server');
      }

      console.log('Redirecting to subscription checkout with session ID:', data.sessionId);
      
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Subscription checkout error:', error);
      throw error;
    }
  }

  return { createPaymentCheckout, createSubscriptionCheckout };
}