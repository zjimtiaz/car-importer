import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/craft";
import { User, Car, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const links = [
  {
    title: "My Profile",
    description: "View and edit your profile information",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "My Listings",
    description: "Manage your car listings",
    href: "/dashboard/my-listings",
    icon: Car,
  },
  {
    title: "Account Settings",
    description: "Change password and preferences",
    href: "/dashboard/profile",
    icon: Settings,
  },
];

export default function DashboardPage() {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Manage your account and listings.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-4 rounded-lg border bg-card p-6 transition-colors hover:border-primary"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <link.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{link.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
