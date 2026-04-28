import { Section, Container } from "@/components/craft";

export default function VehiclesLoading() {
  return (
    <Section>
      <Container>
        <div className="animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex gap-2">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>

          {/* Grid layout */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar skeleton */}
            <div className="hidden lg:block space-y-4">
              <div className="h-8 w-32 rounded bg-muted" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 rounded bg-muted" />
                  <div className="h-10 w-full rounded bg-muted" />
                </div>
              ))}
            </div>

            {/* Cards skeleton */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="h-6 w-48 rounded bg-muted" />
                <div className="h-9 w-24 rounded bg-muted" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-lg border overflow-hidden">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 rounded bg-muted" />
                      <div className="h-4 w-1/2 rounded bg-muted" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 rounded-full bg-muted" />
                        <div className="h-6 w-16 rounded-full bg-muted" />
                      </div>
                      <div className="h-6 w-24 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
