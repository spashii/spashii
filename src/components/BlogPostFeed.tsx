"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GetPostsResponse } from "@/app/api/posts/route";
import { BlogPostPreviewGrid } from "./BlogPostPreview";
import { Confetti } from "./Confetti";

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
  const [showConfetti, setShowConfetti] = useState(false);
  const scrollTrigger = useRef<HTMLDivElement>(null);
  const endMessageRef = useRef<HTMLParagraphElement>(null);

  const loadMorePosts = useCallback(async () => {
    if (nextCursor && !isLoading) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/posts?cursor=${nextCursor}&limit=5`,
          {
            next: {
              revalidate: 1800,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to load more posts");
        }
        const { posts: newPosts, next_cursor } =
          (await response.json()) as unknown as GetPostsResponse;
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
        observer.unobserve(scrollTrigger.current);
      }
    };
  }, [loadMorePosts]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      return;
    }
    const confettiObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !nextCursor) {
          setShowConfetti(true);
        }
      },
      { threshold: 0.1 }
    );
    if (endMessageRef.current) {
      confettiObserver.observe(endMessageRef.current);
    }
    return () => {
      if (endMessageRef.current) {
        confettiObserver.unobserve(endMessageRef.current);
      }
    };
  }, [nextCursor]);

  return (
    <>
      <BlogPostPreviewGrid posts={posts} />
      <div className="text-center text-slate-600 my-12">
        <div className="relative py-8">
          {nextCursor ? (
            <div ref={scrollTrigger}>
              {isLoading
                ? "Hold your horses, loading more posts..."
                : "Scroll for more posts"}
            </div>
          ) : (
            <>
              <p className="text-slate-600 relative z-10" ref={endMessageRef}>
                Congrats, you&apos;ve hit the end!
              </p>
              {showConfetti && posts.length > 5 && (
                <div className="absolute inset-0 z-50">
                  <Confetti />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
