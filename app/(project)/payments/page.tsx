"use client";

import { useCheckout } from "@/app/hooks/useCheckout";
import { usePortal } from "@/app/hooks/usePortal";

export default function Payments() {
  const { createPaymentCheckout, createSubscriptionCheckout } = useCheckout();
  const { createStripePortal } = usePortal();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-4 bg-white p-4 rounded-md">
        <h1 className="text-4xl font-bold">Payments</h1>
        <hr className="w-full border-t border-gray-300" />
        <div className="flex items-center flex-col gap-4">
          <div>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => createPaymentCheckout({
              priceId: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_PRICE_ID,
            })}>Create Payment</button>
          </div>
          <div>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => createSubscriptionCheckout({
              priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID,
            })}>Create Subscription</button>
          </div>
          <div>
            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={createStripePortal}>Create Portal</button>
          </div>
        </div>
      </div>
    </div>
  );
}