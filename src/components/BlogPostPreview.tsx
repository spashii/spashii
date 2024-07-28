"use client";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";

export const BlogPostPreview: FunctionComponent<{
  post: BlogPost;
  small?: boolean;
}> = ({ post, small }) => {
  return (
    <div className="hyphens-auto border dark:border-gray-800 rounded-lg bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-sm">
      <Link href={`/journal/${post.slug}`}>
        <div className="aspect-[16/9] relative">
          <Image
            alt={post.title}
            className="object-cover rounded-t-md"
            src={post.image || "/images/placeholder.webp"}
            fill
          />
        </div>
      </Link>
      <div className="grid grid-cols-1 gap-2 md:col-span-2 mt-4 p-4">
        <h2
          className={cn(
            "font-sans font-semibold tracking-tighter text-primary",
            !small ? "text-2xl md:text-3xl" : "text-xl"
          )}
        >
          <Link href={`/journal/${post.slug}`}>{post.title}</Link>
        </h2>
        <div className="prose lg:prose-lg italic tracking-tighter text-muted-foreground">
          {formatDate(post.publishedAt || post.updatedAt, "dd MMMM yyyy")}
        </div>
        <div
          className={cn(
            "prose lg:prose-lg leading-relaxed text-sm md:text-lg line-clamp-4 text-muted-foreground",
            small ?? "!text-sm"
          )}
        >
          {post.description}
        </div>
        <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <div key={tag.id} className="inline-block">
              <Link href={`/tag/${tag.name}`}>#{tag.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BlogPostPreviewGrid: FunctionComponent<{
  posts: BlogPost[];
  className?: string;
}> = ({ posts, className }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-12 lg:gap-18 md:grid-cols-2",
        className
      )}
    >
      {posts.map((post) => (
        <BlogPostPreview key={post.id} post={post} />
      ))}
    </div>
  );
};
