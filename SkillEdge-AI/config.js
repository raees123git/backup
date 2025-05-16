export const APP_CONFIGS = {
  globalErrorFallback:
    process.env.GLOBAL_ERROR_FALLBACK || "Something went wrong",
};

/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'plus.unsplash.com',
//         pathname: '/**', // Allow all image paths from Unsplash
//       },
//     ],
//   },
// };

export default nextConfig;

