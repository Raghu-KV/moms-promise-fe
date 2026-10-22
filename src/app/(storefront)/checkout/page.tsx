"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Truck,
  Wallet,
  CreditCard,
  XCircle,
} from "lucide-react";
import gsap from "gsap";
import { useAddresses } from "@/lib/hooks/useAddresses";
import { useCart } from "@/lib/hooks/useCart";
import { AddressCard } from "@/components/checkout/AddressCard";
import { AddressForm } from "@/components/checkout/AddressForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePlaceOrder } from "@/lib/hooks/useCheckout";
import type { Address } from "@/lib/api/address";

// Online payment is the only supported method (no cash on delivery).
const PAYMENT_MODE = "online" as const;

function CheckoutContent() {
  const router = useRouter();
  const { data: addresses, isLoading: addressLoading } = useAddresses();
  const { data: cart } = useCart();
  const placeOrder = usePlaceOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // auto-select default address
  useEffect(() => {
    if (addresses && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) setSelectedAddressId(def._id);
    }
  }, [addresses]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      );
    }
  }, []);

  // redirect if cart is empty — but not after placing an order
  useEffect(() => {
    if (orderPlaced) return;
    if (cart === undefined) return;
    if (!cart) return;
    if (Array.isArray(cart.items) && cart.items.length === 0) {
      router.replace("/");
    }
  }, [cart, orderPlaced]);

  const handlePlaceOrder = async () => {
    setError("");
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }
    try {
      setOrderPlaced(true);
      const result = await placeOrder.mutateAsync({
        addressId: selectedAddressId,
        paymentMode: PAYMENT_MODE,
      });
      if (result.requiresPayment) {
        router.push(`/checkout/payment?orderId=${result.order._id}`);
      } else {
        router.push(
          `/checkout/success?orderNumber=${result.order.orderNumber}`,
        );
      }
    } catch (err: any) {
      setOrderPlaced(false);
      setError(
        err?.response?.data?.message ||
        "Something went wrong. Please try again.",
      );
    }
  };

  if (addressLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Checkout
        </h1>
      </div>

      <div
        ref={contentRef}
        className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 lg:gap-10 items-start"
      >
        {/* Left — address + payment */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
          {/* Delivery address */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Truck size={16} className="text-primary" />
              </span>
              Delivery Address
            </h2>

            {!showForm && (
              <div className="space-y-3">
                {addresses?.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    selected={selectedAddressId === address._id}
                    onSelect={() => setSelectedAddressId(address._id)}
                    onEdit={() => {
                      setEditAddress(address);
                      setShowForm(true);
                    }}
                  />
                ))}
                <button
                  onClick={() => {
                    setEditAddress(null);
                    setShowForm(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-card border-2 border-dashed border-primary/30 px-4 py-4 text-sm font-semibold text-primary transition-colors hover:border-primary/60 hover:bg-primary/5"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Plus size={14} />
                  </span>
                  Add new address
                </button>
              </div>
            )}

            {showForm && (
              <div className="rounded-card border border-foreground/10 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  {editAddress ? "Edit Address" : "New Address"}
                </h3>
                <AddressForm
                  editAddress={editAddress}
                  onSuccess={() => {
                    setShowForm(false);
                    setEditAddress(null);
                  }}
                  onCancel={() => {
                    setShowForm(false);
                    setEditAddress(null);
                  }}
                />
              </div>
            )}
          </section>

          {/* Payment mode */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Wallet size={16} className="text-primary" />
              </span>
              Payment Method
            </h2>
            <div className="flex items-start gap-3 rounded-card border-2 border-primary bg-primary/5 px-4 sm:px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <CreditCard size={18} />
              </span>
              <span className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Online Payment
                </p>
                <p className="text-xs text-foreground/50 mt-1">
                  UPI, cards or netbanking via Razorpay
                </p>
              </span>
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-card px-4 py-3">
              {error}
            </p>
          )}

          <Button
            size="lg"
            className="w-full"
            isLoading={placeOrder.isPending}
            onClick={handlePlaceOrder}
            disabled={!selectedAddressId || showForm}
          >
            Continue to Payment
          </Button>
        </div>

        {/* Right — order summary */}
        <div className="order-1 lg:order-2 rounded-card border border-foreground/10 p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-5">
            Order Summary
          </h2>
          <OrderSummary addressId={selectedAddressId ?? undefined} />
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutContent />
    </AuthGuard>
  );
}
