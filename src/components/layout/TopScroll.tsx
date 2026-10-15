// Same repeat/speed logic as home/MarqueeStrip: repeat the messages so one
// group always overflows a wide screen, and keep scroll speed constant.
const CHAR_WIDTH = 7.5;
const ITEM_OVERHEAD = 64; // gap/padding around each message
const MIN_GROUP_WIDTH = 2400;
const SCROLL_SPEED = 25; // px per second

export function TopScroll({ messages }: { messages: string[] }) {
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
    <div
      aria-label="Store announcements"
      className="overflow-hidden bg-highlight py-2 text-xs font-semibold text-foreground"
    >
      <div
        className="marquee-track flex w-max"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {[false, true].map((isDuplicate) => (
          <ul
            key={String(isDuplicate)}
            aria-hidden={isDuplicate}
            className="flex shrink-0 items-center"
          >
            {items.map((message, i) => (
              <li
                key={i}
                aria-hidden={isDuplicate || i >= messages.length}
                className="shrink-0 whitespace-nowrap px-8"
              >
                {message}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
