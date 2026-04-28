import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/craft";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My Listings",
};

export default function MyListingsPage() {
  return (
    <Section>
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your vehicle listings
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border bg-muted/50 py-16 text-center">
          <p className="text-lg font-medium">No listings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your car listings will appear here. To add a new listing, use the
            WordPress admin.
          </p>
          <Button asChild className="mt-4">
            <a
              href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://carimporters.co.uk"}/wp-admin/post-new.php?post_type=vehica_car`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add Listing in WP Admin
            </a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
