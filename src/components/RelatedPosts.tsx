"use client";

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
      <div className="mb-20 text-4xl font-semibold tracking-tight">
        Related Posts
      </div>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {posts.slice(0, 3).map((post) => (
          <BlogPostPreview key={post.id} post={post} small />
        ))}
      </div>
    </div>
  );
};
