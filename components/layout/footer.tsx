"use client";

import { useState } from "react";
import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { Car, Phone, Mail, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "./newsletter-form";

const popularMakes = [
  { name: "BMW", href: "/vehicles/bmw" },
  { name: "Mercedes-Benz", href: "/vehicles/mercedes-benz" },
  { name: "Audi", href: "/vehicles/audi" },
  { name: "Toyota", href: "/vehicles/toyota" },
  { name: "Volkswagen", href: "/vehicles/volkswagen" },
];

function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 lg:border-0">
      {/* Mobile: clickable header with toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left lg:hidden"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {/* Desktop: always-visible header */}
      <h3 className="hidden text-sm font-semibold uppercase tracking-wider lg:block">
        {title}
      </h3>

      {/* Content: collapsible on mobile, always visible on desktop */}
      <div
        className={cn(
          "overflow-hidden transition-all lg:mt-3 lg:max-h-none lg:opacity-100",
          open ? "max-h-96 pb-3 opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter banner */}
      <div className="border-b bg-primary/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get notified about new arrivals and exclusive deals
            </p>
          </div>
          <div className="w-full sm:w-80">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4 lg:gap-8">
          {/* About — always visible, full width on mobile */}
          <div className="pb-4 lg:pb-0">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">{siteConfig.site_name}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {siteConfig.site_description}
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                Contact us for enquiries
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                info@carimporters.co.uk
              </p>
            </div>
          </div>

          {/* 2-column accordion grid on mobile, individual columns on desktop */}
          <div className="col-span-1 grid grid-cols-2 gap-2 lg:col-span-3 lg:grid-cols-3 lg:gap-8">
            {/* Quick Links — accordion on mobile */}
            <FooterAccordion title="Quick Links">
              <ul className="space-y-2 text-sm">
                {Object.entries(mainMenu).map(([key, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {key
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>

            {/* Popular Makes — accordion on mobile */}
            <FooterAccordion title="Popular Makes">
              <ul className="space-y-2 text-sm">
                {popularMakes.map((make) => (
                  <li key={make.name}>
                    <Link
                      href={make.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {make.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>

            {/* Resources — accordion on mobile */}
            <FooterAccordion title="Resources">
              <ul className="space-y-2 text-sm">
                {Object.entries(contentMenu).map(([key, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {key
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
