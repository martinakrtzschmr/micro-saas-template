import "server-only";
import stripe from "@/app/lib/stripe";
import { db } from "@/app/lib/firebase";

export async function getOrCreateCustomer(userId: string, userEmail: string) {
  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const customerId = userData?.stripeCustomerId;

    if (customerId) {
      return customerId;
    }

    const customer = await stripe.customers.create({ email: userEmail });
    await userRef.update({ stripeCustomerId: customer.id });
    return customer.id;
  } catch (err: unknown) {
    throw new Error("Error getting or creating customer");
  }
}