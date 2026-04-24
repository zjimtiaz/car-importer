import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainMenu, contentMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { Car, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const popularMakes = [
  { name: "BMW", href: "/vehicles?make=bmw" },
  { name: "Mercedes-Benz", href: "/vehicles?make=mercedes-benz" },
  { name: "Audi", href: "/vehicles?make=audi" },
  { name: "Toyota", href: "/vehicles?make=toyota" },
  { name: "Volkswagen", href: "/vehicles?make=volkswagen" },
];

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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
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

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {Object.entries(mainMenu).map(([key, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {key.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Makes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Popular Makes
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
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
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {Object.entries(contentMenu).map(([key, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {key.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.site_name}. All rights
            reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
