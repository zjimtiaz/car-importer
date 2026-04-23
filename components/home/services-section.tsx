import { ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";

const services = [
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    description:
      "Every vehicle undergoes rigorous inspection before listing. Drive with confidence.",
  },
  {
    icon: Truck,
    title: "UK-Wide Delivery",
    description:
      "We deliver to your doorstep anywhere in the UK. Hassle-free car buying.",
  },
  {
    icon: CreditCard,
    title: "Finance Available",
    description:
      "Flexible finance options to suit your budget. Get approved in minutes.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description:
      "Our team is here to help you find the right car. Call us anytime.",
  },
];

export function ServicesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Why Choose Us</h2>
          <p className="mt-1 text-muted-foreground">
            Your trusted partner for imported vehicles in the UK
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="flex flex-col items-center rounded-lg border bg-card p-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svc.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{svc.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
