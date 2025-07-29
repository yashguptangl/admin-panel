/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'roomlocus.s3.ap-south-1.amazonaws.com',
                pathname: '**', // Allow all paths under this domain
            },
        ],
        domains : ['roomlocus.s3.ap-south-1.amazonaws.com'], // Add your allowed domains here
    },
};

export default nextConfig;
