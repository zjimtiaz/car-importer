import { getAllAuthors } from "@/lib/wordpress";
import { ArchiveList } from "@/components/archive-list";
import type { Author } from "@/lib/wordpress.d";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Authors",
  description: "Browse all authors of our blog posts",
  alternates: {
    canonical: "/import-news/authors",
  },
};

export default async function Page() {
  const authors = await getAllAuthors();

  return (
    <ArchiveList<Author>
      title="All Authors"
      items={authors}
      getItemHref={(a) => `/import-news/?author=${a.id}`}
      getItemLabel={(a) => a.name}
      emptyMessage="No authors available yet."
    />
  );
}
