import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/posts/post-card";
import type { Post } from "@/lib/wordpress.d";

interface RecentPostsProps {
  posts: Post[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Latest Import News</h2>
            <p className="mt-1 text-muted-foreground">
              Tips, guides, and news about imported cars
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link href="/import-news">
              All News <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="w-[70vw] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
