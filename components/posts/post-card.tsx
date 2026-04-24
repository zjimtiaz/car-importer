import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import { truncateHtml } from "@/lib/metadata";
import { Badge } from "@/components/ui/badge";
import { getPostCategories } from "@/lib/wordpress";

export function PostCard({ post }: { post: Post }) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
  const categories = getPostCategories(post);

  return (
    <Link
      href={`/import-news/${post.slug}`}
      className={cn(
        "group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {media?.source_url ? (
          <Image
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            src={media.source_url}
            alt={post.title?.rendered || "Post thumbnail"}
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {categories.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                className="bg-primary text-primary-foreground text-xs"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-sm sm:text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2"
        />

        <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {post.excerpt?.rendered
            ? truncateHtml(post.excerpt.rendered, 30)
            : "No excerpt available"}
        </div>

        <span className="mt-3 inline-block text-sm font-medium text-primary">
          Read more &rarr;
        </span>
      </div>
    </Link>
  );
}
