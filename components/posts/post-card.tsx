import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import { truncateHtml } from "@/lib/metadata";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: Post }) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
  const category = post._embedded?.["wp:term"]?.[0]?.[0] ?? null;
  const author = post._embedded?.author?.[0] ?? null;
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
      )}
    >
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {media?.source_url ? (
          <Image
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={media.source_url}
            alt={post.title?.rendered || "Post thumbnail"}
            width={600}
            height={300}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {category && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">
            {category.name}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2"
        />

        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {post.excerpt?.rendered
            ? truncateHtml(post.excerpt.rendered, 20)
            : "No excerpt available"}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
          {author?.name && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {author.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
