import type { Metadata } from "next";
import { Container, Section } from "@/components/craft";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ | Car Importers",
  description:
    "Frequently asked questions about Car Importers — importing, finance, delivery, and more.",
};

const faqs = [
  {
    question: "How do you import your vehicles?",
    answer:
      "We source vehicles from trusted global suppliers and handle all import logistics, DVLA registration, and compliance checks. Every vehicle undergoes a thorough inspection before being listed.",
  },
  {
    question: "Do you offer any sort of warranty?",
    answer:
      "Yes, all our vehicles come with a minimum 3-month warranty. Extended warranty options are available at the time of purchase for additional peace of mind.",
  },
  {
    question: "Is finance available?",
    answer:
      "Yes, we offer flexible finance options to suit your budget. Get in touch to discuss your requirements and we'll find a plan that works for you, regardless of your credit history.",
  },
  {
    question: "Do you deliver nationwide?",
    answer:
      "We deliver across the entire UK. Delivery times and costs vary by location — contact us for a quote. We ensure your vehicle arrives safely to your door.",
  },
  {
    question: "Can I part exchange my current vehicle?",
    answer:
      "Yes, we accept part exchanges. Bring your vehicle for a free valuation or contact us with details for a remote estimate. We aim to offer competitive trade-in prices.",
  },
  {
    question: "How can I book a test drive?",
    answer:
      "You can book a test drive by contacting us through our contact page, calling us directly, or sending an enquiry on any vehicle listing. We're happy to arrange viewings at your convenience.",
  },
  {
    question: "How often should I get my oil changed?",
    answer:
      "We recommend following your vehicle manufacturer's guidelines, typically every 5,000–10,000 miles or annually, whichever comes first. Regular oil changes keep your engine running smoothly.",
  },
  {
    question: "What is Auto Detailing?",
    answer:
      "Auto detailing is a thorough cleaning and reconditioning of both the interior and exterior of your vehicle. It goes beyond a standard car wash to restore your car's finish and protect it long-term.",
  },
];

// JSON-LD FAQPage schema for rich snippets
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Section>
        <Container>
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">
            Find answers to common questions about our services
          </p>

          <div className="mt-8 space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border bg-card"
                open={i === 0}
              >
                <summary className="cursor-pointer px-6 py-4 text-lg font-medium hover:text-primary">
                  {faq.question}
                </summary>
                <div className="border-t px-6 py-4 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
