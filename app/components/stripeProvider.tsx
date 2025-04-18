'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

export default function StripeProvider({ children }: { children: React.ReactNode }) {
  // const options = {
  //   // passing the client secret obtained from the server
  //   clientSecret: process.env.STRIPE_SECRET_KEY!,
  // };

  const options = {
    mode: 'payment' as const,
    amount: 1099,
    currency: 'usd',
    // Customizable with appearance API.
    appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
