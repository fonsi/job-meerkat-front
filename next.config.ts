import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true,
    compiler: {
        styledComponents: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
