import Link from "next/link";
import Image from "next/image";
import type { Category, Post } from "@/lib/wordpress.d";
import { SearchInput } from "@/components/posts/search-input";

interface BlogSidebarProps {
  categories: Category[];
  recentPosts: Post[];
  search?: string;
}

export function BlogSidebar({
  categories,
  recentPosts,
  search,
}: BlogSidebarProps) {
  // Filter out "Uncategorised" when other categories exist
  const displayCategories = categories.filter(
    (c) =>
      c.slug !== "uncategorised" &&
      c.slug !== "uncategorized"
  );
  const finalCategories =
    displayCategories.length > 0 ? displayCategories : categories;

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Search</h3>
        <SearchInput defaultValue={search} />
      </div>

      {/* Categories */}
      {finalCategories.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">Categories</h3>
          <ul className="space-y-2">
            {finalCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/import-news?category=${cat.id}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cat.count})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.slice(0, 5).map((post) => {
              const media =
                post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
              return (
                <li key={post.id}>
                  <Link
                    href={`/import-news/${post.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">
                      {media?.source_url ? (
                        <Image
                          src={media.source_url}
                          alt={post.title.rendered.replace(/<[^>]*>/g, "")}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4
                        className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
