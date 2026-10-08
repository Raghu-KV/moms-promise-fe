import { api } from "./client";

export interface MarqueeStrip {
  messages: string[];
}

export const marqueeStripApi = {
  get: async (): Promise<MarqueeStrip | null> => {
    const res = await api.get<{ strip: MarqueeStrip | null }>("/marquee-strip");
    return res.data.strip;
  },
};
