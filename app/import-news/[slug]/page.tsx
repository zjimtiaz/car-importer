import {
  getPostBySlug,
  getPostCategories,
  getPostTags,
  getRecentPosts,
  getAllCategories,
  getPostsPaginated,
} from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article } from "@/components/craft";
import { Badge } from "@/components/ui/badge";
import { BlogSidebar } from "@/components/posts/blog-sidebar";
import { PostCard } from "@/components/posts/post-card";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return generateContentMetadata({
    title: post.title.rendered,
    description: stripHtml(post.excerpt.rendered),
    slug: post.slug,
    basePath: "import-news",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const author = post._embedded?.author?.[0];
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const categories = getPostCategories(post);
  const tags = getPostTags(post);
  const primaryCategory = categories[0] ?? null;

  // Fetch sidebar data + related posts in parallel
  const [allCategories, recentPosts, relatedResponse] = await Promise.all([
    getAllCategories(),
    getRecentPosts(),
    primaryCategory
      ? getPostsPaginated(1, 5, { category: String(primaryCategory.id) })
      : Promise.resolve({ data: [], headers: { total: 0, totalPages: 0 } }),
  ]);

  // Related posts: same category, exclude current post, take 4
  const relatedPosts = relatedResponse.data
    .filter((p) => p.id !== post.id)
    .slice(0, 4);

  // JSON-LD Article schema (keeps date/author for SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title.rendered.replace(/<[^>]*>/g, ""),
    datePublished: post.date,
    dateModified: post.modified,
    author: author?.name
      ? { "@type": "Person", name: author.name }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Car Importers",
      url: "https://carimporters.co.uk",
    },
    image: featuredMedia?.source_url || undefined,
    description: stripHtml(post.excerpt.rendered),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Full-width featured image hero */}
      {featuredMedia?.source_url && (
        <div className="relative h-64 w-full overflow-hidden md:h-[28rem]">
          <Image
            src={featuredMedia.source_url}
            alt={post.title.rendered.replace(/<[^>]*>/g, "")}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <Section>
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/import-news" className="hover:text-foreground">
              Import News
            </Link>
            {primaryCategory && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/import-news?category=${primaryCategory.id}`}
                  className="hover:text-foreground"
                >
                  {primaryCategory.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span
              className="text-foreground line-clamp-1"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </nav>

          {/* Content + Sidebar */}
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/import-news?category=${cat.id}`}
                    >
                      <Badge variant="outline">{cat.name}</Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1
                className="text-3xl font-bold leading-tight md:text-4xl"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              {/* Content */}
              <Article
                className="mt-8"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-6">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tags:
                  </span>
                  {tags.map((tag) => (
                    <Link key={tag.id} href={`/import-news?tag=${tag.id}`}>
                      <Badge variant="secondary">{tag.name}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <BlogSidebar
              categories={allCategories}
              recentPosts={recentPosts}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t pt-10">
              <h2 className="mb-6 text-2xl font-bold">Related Posts</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedPosts.map((rp) => (
                  <PostCard key={rp.id} post={rp} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
