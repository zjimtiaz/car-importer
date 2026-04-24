import type { Metadata } from "next";
import { Container, Section } from "@/components/craft";
import { getPageBySlug } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Car Importers — your trusted source for premium imported vehicles in the UK.",
};

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  return (
    <>
      {/* Hero banner */}
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-r from-primary/90 to-primary/70 text-white md:h-64">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl">About Us</h1>
          <p className="mt-2 text-white/80">
            Your trusted partner for premium imported vehicles
          </p>
        </div>
      </div>

      <Section>
        <Container>
          {page ? (
            <div
              className="prose prose-lg mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content.rendered }}
            />
          ) : (
            <div className="mt-6 space-y-6 text-muted-foreground">
              <p className="text-lg">
                Car Importers is your trusted partner for premium imported vehicles in
                the UK. We source high-quality cars from around the world and deliver
                them to your doorstep.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Our Mission
                  </h3>
                  <p className="mt-2">
                    To make premium imported vehicles accessible and affordable for
                    everyone in the UK.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Quality Assured
                  </h3>
                  <p className="mt-2">
                    Every vehicle goes through a comprehensive inspection before it
                    reaches our showroom.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
