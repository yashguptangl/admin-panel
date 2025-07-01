/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.ap-south-1.amazonaws.com',
                pathname: '**', // Allow all paths under this domain
            },
        ],
        domains : ['s3.ap-south-1.amazonaws.com'], // Add your allowed domains here
    },
};

export default nextConfig;
