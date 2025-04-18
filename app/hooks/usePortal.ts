import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export function usePortal() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      setStripe(stripe);
    }
    loadStripeAsync();
  }, []);

  const createStripePortal = async () => {
    if (!stripe) {
      throw new Error("Stripe is not initialized");
    }

    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();

      if (!data.url) {
        throw new Error('No URL received from server');
      }

      console.log('Redirecting to portal URL:', data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error('Portal error:', error);
      throw error;
    }
  };

  return { createStripePortal };
}