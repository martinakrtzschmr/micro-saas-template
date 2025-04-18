import stripe from "@/app/lib/stripe";
import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateCustomer } from "@/app/server/stripe/customer";

export async function POST(req: NextRequest) {
  const price = process.env.STRIPE_PAYMENT_PRICE_ID;

  if (!price) {
    return NextResponse.json({ error: "Price is required" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = await getOrCreateCustomer(userId, userEmail);

  const metadata = {
    userId,
    userEmail,
    price,
  }

  console.log('Creating checkout session with:', { price, customerId, userEmail });

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      mode: "payment",
      payment_method_types: ["card", "boleto"],
      success_url: `${req.headers.get("origin")}/success`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata,
    });

    console.log('Created session:', checkoutSession.id);

    return NextResponse.json({ sessionId: checkoutSession.id }, { status: 200 });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
