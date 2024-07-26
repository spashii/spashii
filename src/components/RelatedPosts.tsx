"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import { BlogPostPreview } from "./BlogPostPreview";

export const RelatedPosts: FunctionComponent<{
  posts: BlogPost[];
}> = ({ posts }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="my-8 max-w-prose text-xl mx-auto">
      <div className="mb-6 text-lg font-semibold tracking-tight">
        Related Posts
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {posts.slice(0, 3).map((post) => (
          <BlogPostPreview key={post.id} post={post} small />
        ))}
      </div>
    </div>
  );
};
