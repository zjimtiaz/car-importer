import {
  getPostsPaginated,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
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
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";
import { BookOpen } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Car Importers",
  description:
    "News, tips, and insights about imported vehicles, car buying guides, and the UK car market.",
};

export const dynamic = "auto";
export const revalidate = 3600;

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
  const postsPerPage = 9;

  const [postsResponse, authors, tags, categories] = await Promise.all([
    getPostsPaginated(page, postsPerPage, { author, tag, category, search }),
    search ? searchAuthors(search) : getAllAuthors(),
    search ? searchTags(search) : getAllTags(),
    search ? searchCategories(search) : getAllCategories(),
  ]);

  const { data: posts, headers } = postsResponse;
  const { total, totalPages } = headers;

  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    if (author) params.set("author", author);
    if (tag) params.set("tag", tag);
    if (search) params.set("search", search);
    return `/posts${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">Our Blog</h1>
          <p className="mt-2 text-muted-foreground">
            News, tips, and insights about imported vehicles
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} {total === 1 ? "post" : "posts"} found
            {search && ` matching "${search}"`}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <SearchInput defaultValue={search} />
          <FilterPosts
            authors={authors}
            tags={tags}
            categories={categories}
            selectedAuthor={author}
            selectedTag={tag}
            selectedCategory={category}
          />
        </div>

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </Container>
    </Section>
  );
}
