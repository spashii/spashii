"use client";
import Link from "next/link";
import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
// import { Render } from "@9gustin/react-notion-render";

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

  if (!pageProperties) return null;

  const { title, publishedAt, createdAt, tags } = pageProperties;

  return (
    <div className="space-y-4 mb-16">
      <h1 className="text-4xl font-semibold">{title}</h1>

      <div key={theme.resolvedTheme}>
        {/* <Render blocks={pageContent} useStyles classNames /> */}

        <NotionRenderer
          darkMode={theme.resolvedTheme === "dark"}
          recordMap={pageContent}
          isImageZoomable={true}
          disableHeader
          className="!p-0 !max-w-prose !w-full !grid !grid-cols-1 !gap-4"
          components={{
            Code,
            Collection,
            Equation,
            Modal,
            Pdf,
          }}
        />
      </div>
      <div className="text-sm opacity-40">
        {Intl.DateTimeFormat("en-US").format(
          new Date(publishedAt || createdAt)
        )}
      </div>

      <div className="opacity-40 text-sm">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.name}`}
            className="text-primary mr-2"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
