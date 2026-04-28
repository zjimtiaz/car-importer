"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Phone, Mail, Car, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { siteConfig } from "@/site.config";

// Mirror the desktop mega-menu structure exactly
const mobileMenuItems = [
  {
    label: "Cars",
    sections: [
      {
        title: "Browse Cars",
        links: [
          { label: "All Cars", href: "/vehicles" },
          { label: "Featured Cars", href: "/vehicles?featured=true" },
        ],
      },
      {
        title: "By Body Type",
        links: [
          { label: "SUV", href: "/vehicles?bodyType=suv" },
          { label: "Sedan", href: "/vehicles?bodyType=sedan" },
          { label: "Hatchback", href: "/vehicles?bodyType=hatchback" },
          { label: "Coupe", href: "/vehicles?bodyType=coupe" },
          { label: "Convertible", href: "/vehicles?bodyType=convertible" },
        ],
      },
      {
        title: "Popular Makes",
        links: [
          { label: "BMW", href: "/vehicles/bmw" },
          { label: "Mercedes-Benz", href: "/vehicles/mercedes-benz" },
          { label: "Audi", href: "/vehicles/audi" },
          { label: "Toyota", href: "/vehicles/toyota" },
          { label: "Porsche", href: "/vehicles/porsche" },
        ],
      },
    ],
  },
  {
    label: "Pages",
    sections: [
      {
        title: "About",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "FAQ", href: "/faq" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Loan Calculator", href: "/pages/loan-calculator" },
          { label: "Import News", href: "/import-news" },
        ],
      },
      {
        title: "More",
        links: [
          { label: "Our Team", href: "/pages/our-team" },
          { label: "Sold Vehicles", href: "/pages/sold" },
          { label: "Compare", href: "/pages/compare" },
        ],
      },
    ],
  },
];

const simpleLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Import News", href: "/import-news" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 sm:w-80">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-left">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <Car className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">{siteConfig.site_name}</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <nav className="flex flex-col py-2">
            {/* Simple top links */}
            {simpleLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-6 py-3 text-[15px] font-medium hover:bg-muted/50 transition-colors border-b border-border/40",
                  isActive(item.href) && "text-primary bg-primary/5"
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Expandable mega-menu sections (matching desktop) */}
            {mobileMenuItems.map((item) => (
              <div key={item.label} className="border-b border-border/40">
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className="flex w-full items-center justify-between px-6 py-3 text-left text-[15px] font-medium hover:bg-muted/50 transition-colors"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      expandedItems.has(item.label) && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    expandedItems.has(item.label)
                      ? "max-h-[800px] opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <div className="bg-muted/30 pb-2">
                    {item.sections.map((section) => (
                      <div key={section.title} className="px-6 py-2">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {section.title}
                        </p>
                        {section.links.map((link) => (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 pl-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Contact info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background px-6 py-4 space-y-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Contact Us
          </p>
          <a
            href="tel:+44000000000"
            className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4 text-primary" />
            Call Us
          </a>
          <a
            href="mailto:info@carimporters.co.uk"
            className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4 text-primary" />
            info@carimporters.co.uk
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
