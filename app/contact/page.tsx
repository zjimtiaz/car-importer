"use client";

import { useState } from "react";
import { Container, Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
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
          message: form.get("message"),
        }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    {/* Hero banner */}
    <div className="relative flex h-48 items-center justify-center bg-gradient-to-r from-primary/90 to-primary/70 text-white md:h-64">
      <div className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
        <p className="mt-2 text-white/80">
          Get in touch with our team — we&apos;re here to help
        </p>
      </div>
    </div>

    <Section>
      <Container>

        {/* 3-column layout */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Column 1: Contact Form */}
          <div className="lg:col-span-1">
            {submitted ? (
              <div className="rounded-lg border bg-primary/5 p-8 text-center">
                <h2 className="text-xl font-semibold">Thank You!</h2>
                <p className="mt-2 text-muted-foreground">
                  We&apos;ve received your message and will get back to you
                  shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" name="phone" type="tel" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <div className="rounded-lg border bg-card p-6 h-full">
              <h3 className="text-lg font-semibold">Get In Touch</h3>
              <div className="mt-4 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">Call for enquiries</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      info@carimporters.co.uk
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-muted-foreground">
                      Mon-Fri: 9am - 6pm
                      <br />
                      Sat: 10am - 4pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Business Address */}
          <div>
            <div className="rounded-lg border bg-card p-6 h-full">
              <h3 className="text-lg font-semibold">Our Address</h3>
              <div className="mt-4 space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      Car Importers
                      <br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map row */}
        <div className="mt-8 overflow-hidden rounded-lg border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5415644812844!2d-0.1277583!3d51.5073509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjUiTiAwwrAwNyc0MC4wIlc!5e0!3m2!1sen!2suk!4v1600000000000"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Car Importers Location"
          />
        </div>
      </Container>
    </Section>
    </>
  );
}
