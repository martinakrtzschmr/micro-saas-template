import "server-only";

import { db } from "@/app/lib/firebase";

import Stripe from "stripe";

export async function handleStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    console.log("Payment successful");

    const metadata = event.data.object.metadata as {
      userId: string,
      userEmail: string,
      price: string,
    };

    const subscriptionId = event.data.object.subscription;
    
    await db.collection("users").doc(metadata.userId).update({
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
    });
  }

  if (event.data.object.payment_status === "unpaid") {
    console.log("Payment failed");
  }
}