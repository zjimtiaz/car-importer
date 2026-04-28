"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { UserMenu } from "@/components/auth/user-menu";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { Car, ChevronDown } from "lucide-react";
import Link from "next/link";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

// Mega menu structure — client can fill in more links later
const megaMenus: Record<
  string,
  { columns: { title: string; links: { label: string; href: string; desc?: string }[] }[] }
> = {
  Cars: {
    columns: [
      {
        title: "Browse Cars",
        links: [
          { label: "All Cars", href: "/vehicles", desc: "View our full inventory" },
          { label: "Featured Cars", href: "/vehicles?featured=true", desc: "Hand-picked best value" },
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
  Pages: {
    columns: [
      {
        title: "About",
        links: [
          { label: "About Us", href: "/about", desc: "Learn about our company" },
          { label: "Contact", href: "/contact", desc: "Get in touch with us" },
          { label: "FAQ", href: "/faq", desc: "Frequently asked questions" },
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
};

// Simple nav links (no dropdown)
const simpleLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Import News", href: "/import-news" },
  { label: "Contact", href: "/contact" },
];

export function Nav({ className, children, id }: NavProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        "sticky z-50 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-b",
        className
      )}
      id={id}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div
        id="nav-container"
        className="max-w-7xl mx-auto py-3 px-6 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-2 items-center"
          href="/"
        >
          <Car className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">{siteConfig.site_name}</span>
        </Link>

        {children}

        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex items-center">
            {/* Simple links */}
            {simpleLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(isActive(link.href) && "bg-primary/10 text-primary")}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}

            {/* Mega menu triggers */}
            {Object.entries(megaMenus).map(([label, menu]) => (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => setOpenMenu(label)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    setOpenMenu(openMenu === label ? null : label)
                  }
                >
                  {label}
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform",
                      openMenu === label && "rotate-180"
                    )}
                  />
                </Button>

                {/* Mega dropdown */}
                {openMenu === label && (
                  <div className="absolute right-0 top-full pt-2">
                    <div className="rounded-lg border bg-card shadow-xl p-6 min-w-[600px]">
                      <div
                        className="grid gap-8"
                        style={{
                          gridTemplateColumns: `repeat(${menu.columns.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {menu.columns.map((col) => (
                          <div key={col.title}>
                            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
                              {col.title}
                            </h4>
                            <ul className="space-y-1">
                              {col.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenMenu(null)}
                                    className="block rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
                                  >
                                    <span className="font-medium">
                                      {link.label}
                                    </span>
                                    {link.desc && (
                                      <span className="block text-xs text-muted-foreground">
                                        {link.desc}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:flex">
            <UserMenu />
          </div>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
