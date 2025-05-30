/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "http.cat",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/blog/tech-journal-is-live",
        destination: "/blog/dev-journal-is-live",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
