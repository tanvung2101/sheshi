/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "plus.unsplash.com",
      "ap-southeast-1-ddfe-dev-app.s3.ap-southeast-1.amazonaws.com",
      "media.istockphoto.com",
      "play-lh.googleusercontent.com",
      "upload.wikimedia.org",
      "news.khangz.com",
      "ap-southeast-1-sheshi-dev-app.s3.ap-southeast-1.amazonaws.com",
    ],
  },
  async headers() {
    return [
      {
        source: "/san-pham/slug",
        headers: [
          {
            key: "/",
            value: "/", // Matched parameters can be used in the value
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
