import { topScrollApi } from "@/lib/api/topScroll";
import { TopScroll } from "./TopScroll";

export async function TopScrollSection() {
  const message = await topScrollApi.get().catch(() => null);
  if (!message || message.status !== "active") return null;
  const messages = message.messages.filter((m) => m.trim().length > 0);
  if (messages.length === 0) return null;
  return <TopScroll messages={messages} />;
}
