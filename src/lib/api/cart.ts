import { api } from "./client";

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  name?: string;
  slug?: string;
  age?: string;
  color?: string | null;
  image?: string | null;
  unitPrice?: number;
  lineTotal?: number;
  available?: boolean;
  stockRemaining?: number;
  priceChanged?: boolean;
  issue?: string;
}

export interface CartResponse {
  cartId: string;
  items: CartItem[];
  subtotal: number;
  couponCode: string | null;
  hasIssues: boolean;
}

export interface ApplyCouponResponse {
  message: string;
  discountAmount: number;
  cart: CartResponse;
}

export const cartApi = {
  get: async (): Promise<CartResponse> => {
    const res = await api.get<CartResponse>("/cart");
    return res.data;
  },

  addItem: async (
    productId: string,
    variantId: string,
    quantity: number,
  ): Promise<CartResponse> => {
    const res = await api.post<CartResponse>("/cart/items", {
      productId,
      variantId,
      quantity,
    });
    return res.data;
  },

  updateItem: async (
    variantId: string,
    quantity: number,
  ): Promise<CartResponse> => {
    const res = await api.put<CartResponse>(`/cart/items/${variantId}`, {
      quantity,
    });
    return res.data;
  },

  removeItem: async (variantId: string): Promise<CartResponse> => {
    const res = await api.delete<CartResponse>(`/cart/items/${variantId}`);
    return res.data;
  },

  clear: async (): Promise<void> => {
    await api.delete("/cart");
  },

  applyCoupon: async (code: string): Promise<ApplyCouponResponse> => {
    const res = await api.post<ApplyCouponResponse>("/coupons/apply", { code });
    return res.data;
  },

  removeCoupon: async (): Promise<CartResponse> => {
    const res = await api.post<CartResponse>("/coupons/remove");
    return res.data;
  },
};
