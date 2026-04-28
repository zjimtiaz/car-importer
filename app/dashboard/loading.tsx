import { Section, Container } from "@/components/craft";

export default function DashboardLoading() {
  return (
    <Section>
      <Container>
        <div className="animate-pulse">
          <div className="h-8 w-40 rounded bg-muted mb-2" />
          <div className="h-4 w-64 rounded bg-muted mb-8" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-6 space-y-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="h-5 w-32 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
