import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/organizations",
        destination: "/organizations",
        permanent: false,
      },
      {
        source: "/dashboard/organizations/:path*",
        destination: "/organizations/:path*",
        permanent: false,
      },
      {
        source: "/dashboard/profile",
        destination: "/profile",
        permanent: false,
      },
      {
        source: "/dashboard/audit-log",
        destination: "/audit-log",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
