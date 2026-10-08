import { Sparkles } from "lucide-react";
import { marqueeStripApi } from "@/lib/api/marqueeStrip";

// Rough rendering estimates (px) used only to decide how many times to repeat
// the messages so one group always overflows a wide screen, and to keep the
// scroll speed constant no matter how much text the admin enters.
const CHAR_WIDTH = 8.5;
const ITEM_OVERHEAD = 48; // icon + gaps around each message
const MIN_GROUP_WIDTH = 2400;
const SCROLL_SPEED = 25; // px per second

export async function MarqueeStrip() {
  const strip = await marqueeStripApi.get().catch(() => null);
  const messages = strip?.messages.filter((m) => m.trim().length > 0) ?? [];
  if (messages.length === 0) return null;

  const cycleWidth = messages.reduce(
    (sum, m) => sum + m.length * CHAR_WIDTH + ITEM_OVERHEAD,
    0,
  );
  const copies = Math.max(1, Math.ceil(MIN_GROUP_WIDTH / cycleWidth));
  const duration = Math.round((cycleWidth * copies) / SCROLL_SPEED);

  const items = Array.from({ length: copies }, () => messages).flat();

  // Two identical groups side by side, translated by exactly one group's
  // width (see .marquee-track in globals.css) so the loop is seamless.
  return (
    <section
      aria-label="Store highlights"
      className="overflow-hidden bg-highlight py-2.5 text-sm font-medium text-foreground sm:text-base"
    >
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[false, true].map((isDuplicate) => (
          <ul
            key={String(isDuplicate)}
            aria-hidden={isDuplicate}
            className="flex shrink-0 items-center gap-4 pr-4"
          >
            {items.map((message, i) => (
              <li
                key={i}
                aria-hidden={isDuplicate || i >= messages.length}
                className="flex shrink-0 items-center gap-4 whitespace-nowrap"
              >
                <span>{message}</span>
                <Sparkles size={16} className="shrink-0" aria-hidden="true" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
