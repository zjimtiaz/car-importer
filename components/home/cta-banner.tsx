import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Find Your Next Car?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg opacity-90">
          Browse our full inventory or get in touch with our team. We&apos;re here
          to help you find the perfect vehicle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            asChild
          >
            <Link href="/vehicles">Browse Inventory</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            asChild
          >
            <Link href="/contact">
              <Phone className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
