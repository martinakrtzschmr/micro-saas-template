import stripe from "@/app/lib/stripe";
import { handleStripeCancel } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

if (!secret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const event = stripe.webhooks.constructEvent(payload, signature, secret);

  switch (event.type) {
    case "checkout.session.completed": // User has successfully purchased a subscription
      const metadata = event.data.object.metadata;

      if (metadata?.price === process.env.STRIPE_PAYMENT_PRICE_ID) {
        await handleStripePayment(event);
      }

      if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
        await handleStripeSubscription(event);
      }

      break;
    case "checkout.session.expired": // User has not completed the purchase
      console.log("Checkout session expired", event);
      break;
    case "checkout.session.async_payment_succeeded": // User has successfully completed the purchase
      console.log("Checkout session async payment succeeded", event);
      break;
    case "checkout.session.async_payment_failed": // User has failed to complete the purchase
      console.log("Checkout session async payment failed", event);
      break;
    case "customer.subscription.created": // User has successfully created a subscription
      console.log("Customer subscription created", event);
      break;
    case "customer.subscription.updated": // User has updated their subscription
      console.log("Customer subscription updated", event);
      break;
    case "customer.subscription.deleted": // User has cancelled their subscription
      await handleStripeCancel(event);
      break;
    default:
      console.log("Unhandled event type", event.type);
      break;
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}

