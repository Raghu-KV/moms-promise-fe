"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils/currency";
import { optimizedImageUrl } from "@/lib/utils/cloudinary";
import { CouponInput } from "@/components/cart/CouponInput";
import { useCheckoutSummary } from "@/lib/hooks/useCheckout";
import { Skeleton } from "@/components/ui/Skeleton";

interface OrderSummaryProps {
  addressId?: string;
}

export function OrderSummary({ addressId }: OrderSummaryProps) {
  const { data: summary, isLoading } = useCheckoutSummary(addressId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const { items, pricing, couponCode, freeShippingThreshold, shippingNote } = summary;
  const remainingForFreeShipping =
    freeShippingThreshold - (pricing.subtotal - pricing.discount);

  return (
    <div className="space-y-4">
      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3">
            <div className="relative h-16 w-14 shrink-0 rounded-md overflow-hidden bg-foreground/5">
              {item.image && (
                <Image
                  src={optimizedImageUrl(item.image, "w_200")}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <div className="flex gap-2 text-xs text-foreground/50 mt-0.5">
                {item.age && <span>{item.age} yrs</span>}
                {item.color && <span>{item.color}</span>}
                <span>× {item.quantity}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground shrink-0">
              {formatPrice(item.lineTotal)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-foreground/10 pt-4">
        <CouponInput appliedCode={couponCode} />
      </div>

      {/* Free shipping progress */}
      {pricing.shippingFee > 0 && remainingForFreeShipping > 0 && (
        <p className="text-xs text-foreground/60 bg-highlight/20 rounded-card px-3 py-2">
          Add {formatPrice(remainingForFreeShipping)} more for free shipping
        </p>
      )}

      {/* Pricing breakdown */}
      <div className="border-t border-foreground/10 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-foreground/70">
          <span>Subtotal</span>
          <span>{formatPrice(pricing.subtotal)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount {couponCode && `(${couponCode})`}</span>
            <span>− {formatPrice(pricing.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-foreground/70">
          <span>Shipping</span>
          <div className="text-right">
            <span>{pricing.shippingFee === 0 ? "Free" : formatPrice(pricing.shippingFee)}</span>
          </div>
        </div>
        <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-foreground/10">
          <span>Total</span>
          <span className="text-lg">{formatPrice(pricing.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}