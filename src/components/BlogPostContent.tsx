"use client";
import Link from "next/link";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Image from "next/image";

import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { formatDate } from "date-fns";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

export const BlogPostContent = ({
  pageProperties,
  pageContent,
}: {
  pageProperties: BlogPost;
  pageContent: any;
}) => {
  const theme = useTheme();

  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setDarkMode(theme.resolvedTheme === "dark");
    setLoading(false);
  }, [theme.resolvedTheme, setLoading]);

  if (!pageProperties) return null;
  if (loading) return <Loading />;

  return (
    <div className="mb-16 grid grid-cols-1 gap-4 mx-auto items-center max-w-prose">
      <h1 className="text-4xl font-semibold">{pageProperties.title}</h1>

      <div
        key={darkMode ? "dark" : "light"}
        className="prose prose-slate p-0  w-full dark:prose-invert "
      >
        {/* <Render blocks={pageContent} blockComponentsMapper={{}} /> */}

        <NotionRenderer
          darkMode={darkMode}
          recordMap={pageContent}
          rootDomain="https://www.notion.so"
          rootPageId={pageProperties.id}
          mapPageUrl={(pageId) => {
            return `/journal/id/${encodeURIComponent(pageId)}`;
          }}
          mapImageUrl={(url) => {
            return url;
          }}
          isImageZoomable={true}
          components={{
            Code,
            Collection,
            Equation,
            Modal,
            Pdf,
            nextLink: Link,
            nextImage: Image,
          }}
        />
      </div>
      <div className="prose lg:prose-lg italic tracking-tighter text-muted-foreground">
        {formatDate(
          pageProperties.publishedAt || pageProperties.updatedAt,
          "dd MMMM yyyy"
        )}
      </div>
      <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
        {pageProperties.tags.map((tag) => (
          <div key={tag.id} className="inline-block">
            <Link href={`/tag/${tag.name}`}>#{tag.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
