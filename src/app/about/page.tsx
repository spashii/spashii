import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import Markdown from "react-markdown";

const content = `Uh oh! Looks like I haven't written anything about myself yet. Check back later!`;

export async function generateMetadata() {
  return {
    title: "About Me",
    description: "Learn more about @spashii and his adventures",
    openGraph: {
      title: "About Me",
      description: "Learn more about @spashii and his adventures",
      images: [
        signOgImageUrl({
          title: "About @spashii",
          label: "About",
          brand: config.blog.name,
        }),
      ],
    },
  };
}

const Page = async () => {
  return (
    <div>
      <div className="prose lg:prose-lg dark:prose-invert m-auto blog-content">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};

export default Page;
