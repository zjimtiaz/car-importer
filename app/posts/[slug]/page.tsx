import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";
import { generateContentMetadata, stripHtml } from "@/lib/metadata";

import { Section, Container, Article } from "@/components/craft";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronRight,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

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
    basePath: "posts",
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
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // JSON-LD Article schema
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

      <Section>
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/posts" className="hover:text-foreground">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span
              className="text-foreground line-clamp-1"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </nav>

          <div className="mx-auto max-w-3xl">
            {/* Category + Meta */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {category && (
                <Link href={`/posts/?category=${category.id}`}>
                  <Badge variant="outline">{category.name}</Badge>
                </Link>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-3xl font-bold leading-tight md:text-4xl"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Author + Date */}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
              {author?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <Link
                    href={`/posts/?author=${author.id}`}
                    className="hover:text-foreground"
                  >
                    {author.name}
                  </Link>
                </span>
              )}
            </div>

            <Separator className="my-6" />

            {/* Featured Image */}
            {featuredMedia?.source_url && (
              <div className="relative mb-8 h-64 overflow-hidden rounded-lg md:h-96">
                <Image
                  src={featuredMedia.source_url}
                  alt={post.title.rendered.replace(/<[^>]*>/g, "")}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <Article
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            <Separator className="my-8" />

            {/* Back to blog */}
            <Button variant="outline" asChild>
              <Link href="/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
