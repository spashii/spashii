"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { GetPostsResponse } from "@/app/api/posts/route";
import { BlogPostsPreview } from "./BlogPostPreview";

type PostListProps = {
  initialPosts: BlogPost[];
  initialNextCursor?: string | undefined;
};

export default function BlogPostFeed({
  initialPosts,
  initialNextCursor,
}: PostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialNextCursor
  );
  const [isLoading, setIsLoading] = useState(false);
  const scrollTrigger = useRef<HTMLDivElement>(null);

  const loadMorePosts = useCallback(async () => {
    if (nextCursor && !isLoading) {
      setIsLoading(true);
      try {
        const response = await axios.get<GetPostsResponse>(
          `/api/posts?cursor=${nextCursor}&limit=5`
        );
        const { posts: newPosts, next_cursor } = response.data;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setNextCursor(next_cursor);
      } catch (error) {
        console.error("Error loading more posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [nextCursor, isLoading]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    if (scrollTrigger.current) {
      observer.observe(scrollTrigger.current);
    }

    return () => {
      if (scrollTrigger.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(scrollTrigger.current);
      }
    };
  }, [loadMorePosts]);

  return (
    <>
      <BlogPostsPreview posts={posts} />
      <div className="text-center text-slate-600 my-12">
        {nextCursor ? (
          <div ref={scrollTrigger}>
            {isLoading
              ? "Hold your horses, we're loading more posts..."
              : "Scroll for more posts"}
          </div>
        ) : (
          <p className="text-slate-600">Congrats, you&apos;ve hit the end!</p>
        )}
      </div>
    </>
  );
}
