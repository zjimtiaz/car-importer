import { Section, Container } from "@/components/craft";

export default function ImportNewsLoading() {
  return (
    <Section>
      <Container>
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-muted mb-2" />
          <div className="h-4 w-72 rounded bg-muted mb-8" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <div className="aspect-video bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-20 rounded-full bg-muted" />
                  <div className="h-5 w-full rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
