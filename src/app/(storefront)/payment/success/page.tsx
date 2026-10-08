"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Razorpay sends the customer here after they pay (or abandon) a payment
// link, with the outcome in the query string. This page only tells the
// customer what happened — the order itself is updated server-side from
// Razorpay's own confirmation, never from this URL.
function PaymentLinkResult() {
  const searchParams = useSearchParams();
  const paid = searchParams.get("razorpay_payment_link_status") === "paid";

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        {paid ? (
          <CheckCircle size={64} className="text-green-500" />
        ) : (
          <Clock size={64} className="text-foreground/40" />
        )}
        <div>
          <h1 className="text-3xl text-primary mb-2">
            {paid ? "Payment received!" : "Payment not completed"}
          </h1>
          <p className="text-foreground/70 mt-3 max-w-sm mx-auto">
            {paid
              ? "Thank you! We've received your payment and your order will be confirmed shortly."
              : "We haven't received a payment yet. If you've already paid, please wait a moment, or use the payment link again."}
          </p>
        </div>
        <Image src="/girl.svg" alt="Happy kid" width={130} height={178} />
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </main>
  );
}

export default function PaymentLinkSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentLinkResult />
    </Suspense>
  );
}
