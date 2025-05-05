/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        remotePatterns: [
          {
                protocol: 'https',
                hostname: 'stock.adobe.com',
                port: '',
                pathname: '/search',
                search: 'k=placeholder',
          },
          {
            protocol: 'https',
            hostname: 'plus.unsplash.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'unsplash.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'tinyurl.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn.site.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'mavericks-bookit-uploads.s3.us-east-2.amazonaws.com',
            port: '',
            pathname: '/**',
          }
        ],
      },
};

export default nextConfig;
