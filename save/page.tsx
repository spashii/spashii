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

        <h2 className="text-2xl font-bold mt-6 mb-4">Contact</h2>
        <p className="mb-2">You can reach me via Signal:</p>
        <ul className="list-disc list-inside">
          <li className="mb-1">
            <span className="font-semibold">Signal:</span>
            <span className="ml-1">@shroom.01</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
