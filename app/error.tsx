"use client";

import { useEffect } from "react";
import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-8 text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <Button onClick={reset} className="not-prose mt-6">
            Try Again
          </Button>
        </div>
      </Container>
    </Section>
  );
}
