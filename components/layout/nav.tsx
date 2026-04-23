import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/nav/mobile-nav";
import { UserMenu } from "@/components/auth/user-menu";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";
import Link from "next/link";

interface NavProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ className, children, id }: NavProps) {
  return (
    <nav
      className={cn(
        "sticky z-50 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-b",
        className
      )}
      id={id}
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
          <div className="mx-2 hidden md:flex">
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant="ghost" size="sm">
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
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
