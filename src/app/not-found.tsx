import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center flex flex-col items-center gap-6">
      <Image
        src="/boy.svg"
        alt="Lost kid"
        width={140}
        height={168}
      />
      <div>
        <h1 className="text-6xl text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Page not found
        </h2>
        <p className="text-sm text-foreground/60 max-w-sm mx-auto">
          Looks like this page flew away! Let's get you back to something fun.
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">Shop Now</Button>
        </Link>
      </div>
    </main>
  );
}
