import type { Metadata } from "next";
import { Container, Section } from "@/components/craft";
import { getPageBySlug } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Car Importers — importing, finance, delivery, and more.",
};

const defaultFaqs = [
  {
    question: "How do you import your vehicles?",
    answer:
      "We source vehicles from trusted global suppliers and handle all import logistics, DVLA registration, and compliance checks.",
  },
  {
    question: "Is finance available?",
    answer:
      "Yes, we offer flexible finance options. Get in touch to discuss your requirements and we'll find a plan that works for you.",
  },
  {
    question: "Do you deliver nationwide?",
    answer:
      "We deliver across the entire UK. Delivery times and costs vary by location — contact us for a quote.",
  },
  {
    question: "What warranty do your cars come with?",
    answer:
      "All our vehicles come with a minimum 3-month warranty. Extended warranty options are available at purchase.",
  },
  {
    question: "Can I part exchange my current vehicle?",
    answer:
      "Yes, we accept part exchanges. Bring your vehicle for a free valuation or contact us with details for a remote estimate.",
  },
  {
    question: "How can I book a test drive?",
    answer:
      "You can book a test drive by contacting us through our contact page, calling us directly, or sending an enquiry on any vehicle listing.",
  },
];

export default async function FaqPage() {
  const page = await getPageBySlug("faq");

  // JSON-LD FAQPage schema for rich snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: defaultFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

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

        {page ? (
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content.rendered }}
          />
        ) : (
          <div className="mt-8 space-y-4">
            {defaultFaqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border bg-card"
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
        )}
      </Container>
    </Section>
    </>
  );
}
