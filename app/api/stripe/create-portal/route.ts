import { auth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRef = db.collection("users").doc(user.id);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData?.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer found" }, { status: 404 });
    }

    console.log('Creating portal session for customer:', userData.stripeCustomerId);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: `${req.headers.get("origin")}/dashboard`,
    });

    if (!portalSession?.url) {
      throw new Error('Portal session URL not found');
    }

    console.log('Created portal session with URL:', portalSession.url);

    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}