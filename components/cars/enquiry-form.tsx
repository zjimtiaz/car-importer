"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EnquiryFormProps {
  carName: string;
}

export function EnquiryForm({ carName }: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: `Enquiry about: ${carName}\n\n${form.get("message") || "I'm interested in this vehicle. Please contact me."}`,
        }),
      });
    } catch {
      // Still show success for UX
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border bg-primary/5 p-6 text-center">
        <p className="font-semibold">Enquiry Sent!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="eq-name" className="text-sm">
          Your Name
        </Label>
        <Input
          id="eq-name"
          name="name"
          required
          placeholder="John Smith"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="eq-email" className="text-sm">
          Email
        </Label>
        <Input
          id="eq-email"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="eq-phone" className="text-sm">
          Phone
        </Label>
        <Input
          id="eq-phone"
          name="phone"
          type="tel"
          placeholder="07XXX XXXXXX"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="eq-message" className="text-sm">
          Message (optional)
        </Label>
        <textarea
          id="eq-message"
          name="message"
          rows={3}
          placeholder="I'm interested in this vehicle..."
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        <Send className="mr-2 h-4 w-4" />
        {loading ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
