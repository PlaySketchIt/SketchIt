/** @type {import("next").NextConfig} */
const nextConfig = {
    //output: "export", // Outputs a Single-Page Application (SPA). // disabled so api routes work. revert for cheaper deployment if we decide not to use api routes.

    // use rewrites to serve html directly without boilerplate
    rewrites: async () => [
        {
            source: "/privacy",
            destination: "/html/privacy.html",
        },
    ],
};

export default nextConfig;
