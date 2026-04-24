"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, Phone, Mail } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/site.config";

// Menu structure with sub-items for dropdown
const mobileMenuItems = [
  { label: "Home", href: "/" },
  {
    label: "Cars",
    href: "/vehicles",
    children: [
      { label: "All Cars", href: "/vehicles" },
      { label: "Featured", href: "/vehicles?featured=true" },
    ],
  },
  {
    label: "Pages",
    href: "#",
    children: [
      { label: "About Us", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Loan Calculator", href: "/pages/loan-calculator" },
    ],
  },
  { label: "Import News", href: "/import-news" },
  { label: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set()
  );

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
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-left">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-lg font-bold"
            >
              {siteConfig.site_name}
            </Link>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <nav className="flex flex-col">
            {mobileMenuItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="flex w-full items-center justify-between px-6 py-3.5 text-left text-[15px] font-medium hover:bg-muted transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground transition-transform",
                          expandedItems.has(item.label) && "rotate-180"
                        )}
                      />
                    </button>
                    {expandedItems.has(item.label) && (
                      <div className="bg-muted/50">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block px-10 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-3.5 text-[15px] font-medium hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                <Separator />
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Contact info at bottom */}
        <div className="border-t px-6 py-4 space-y-2">
          <a
            href="tel:+44000000000"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            Contact Us
          </a>
          <a
            href="mailto:info@carimporters.co.uk"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
            info@carimporters.co.uk
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
