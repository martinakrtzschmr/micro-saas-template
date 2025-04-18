import { handleLogout } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import CheckoutForm from "@/app/components/checkoutForm";
import StripeProvider from "@/app/components/stripeProvider";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Protected Dashboard</h1>
      <p>{session?.user?.email ? "Logged in" : "Not logged in"}</p>
      <form action={handleLogout}>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Logout</button>
      </form>

      <StripeProvider>
        <CheckoutForm />
      </StripeProvider>

      <Link href="/payments" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Payments</Link>
    </div>
  );
}