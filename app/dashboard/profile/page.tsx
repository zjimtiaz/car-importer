"use client";

import { Container, Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account information
        </p>

        <div className="mt-8 max-w-lg space-y-6">
          <div>
            <Label>Display Name</Label>
            <Input
              defaultValue={user?.displayName || ""}
              className="mt-1"
              readOnly
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              defaultValue={user?.email || ""}
              className="mt-1"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            To update your profile, please use the{" "}
            <a
              href="https://carimporters.co.uk/wp-admin/profile.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WordPress admin panel
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
