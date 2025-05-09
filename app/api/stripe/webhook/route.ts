import { NextRequest, NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";
import { db } from "@/app/lib/firebase";
import { handleStripeCancel } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err: unknown) {
      console.error(`Webhook signature verification failed:`, err);
      return NextResponse.json({ error: `Webhook Error: ${err}` }, { status: 400 });
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const userEmail = session.metadata?.userEmail;

        if (!userId || !userEmail) {
          console.error("Missing user data in session metadata");
          return NextResponse.json({ error: "Missing user data" }, { status: 400 });
        }

        const userRef = db.collection("users").doc(userId);
        await userRef.set(
          {
            stripeCustomerId: session.customer,
            email: userEmail,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        if (session.metadata?.price === process.env.STRIPE_PAYMENT_PRICE_ID) {
          await handleStripePayment(event);
        }

        if (session.metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
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
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

