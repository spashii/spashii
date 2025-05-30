const buildConfig = () => {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID;
  if (!blogId) throw new Error("NEXT_PUBLIC_BLOG_ID is missing");
  const name = process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME || "spashii.dev";
  const copyright = process.env.NEXT_PUBLIC_BLOG_COPYRIGHT || "spashii";
  const defaultTitle =
    process.env.NEXT_DEFAULT_METADATA_DEFAULT_TITLE || "spashii.dev";
  const defaultDescription =
    process.env.NEXT_PUBLIC_BLOG_DESCRIPTION ||
    "Tech journal, blog and a colection of notes. Built on Next.js, Notion API and Vercel.";

  return {
    revalidateSeconds: 1800,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://spashii.dev",
    blog: {
      name,
      copyright,
      metadata: {
        title: {
          absolute: defaultTitle,
          default: defaultTitle,
          template: `%s - ${defaultTitle}`,
        },
        description: defaultDescription,
      },
    },
    ogImageSecret:
      process.env.OG_IMAGE_SECRET ||
      "secret_used_for_signing_and_verifying_the_og_image_url_by_spashii",
  };
};

export const config = buildConfig();
