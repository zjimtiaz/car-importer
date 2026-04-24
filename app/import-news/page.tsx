import {
  getPostsPaginated,
  getRecentPosts,
  getAllCategories,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Section, Container } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { BlogSidebar } from "@/components/posts/blog-sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import News — Car Importers",
  description:
    "News, tips, and insights about imported vehicles, car buying guides, and the UK car market.",
};

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { author, tag, category, page: pageParam, search } = params;

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 6;

  const [postsResponse, categories, recentPostsList] = await Promise.all([
    getPostsPaginated(page, postsPerPage, { author, tag, category, search }),
    getAllCategories(),
    getRecentPosts(),
  ]);

  const { data: posts, headers } = postsResponse;
  const { totalPages } = headers;

  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/import-news${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <Section>
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Import News</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Import News</h1>
          <p className="mt-2 text-muted-foreground">
            News, tips, and insights about imported vehicles
          </p>
        </div>

        {/* Main layout: posts grid + sidebar */}
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Posts */}
          <div>
            {posts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border bg-muted/50">
                <p className="text-muted-foreground">No posts found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <Pagination>
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href={createPaginationUrl(page - 1)}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (pageNum) =>
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - page) <= 1
                      )
                      .map((pageNum, index, array) => {
                        const showEllipsis =
                          index > 0 && pageNum - array[index - 1] > 1;
                        return (
                          <div key={pageNum} className="flex items-center">
                            {showEllipsis && <span className="px-2">...</span>}
                            <PaginationItem>
                              <PaginationLink
                                href={createPaginationUrl(pageNum)}
                                isActive={pageNum === page}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}
                    {page < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPaginationUrl(page + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <BlogSidebar
            categories={categories}
            recentPosts={recentPostsList}
            search={search}
          />
        </div>
      </Container>
    </Section>
  );
}
