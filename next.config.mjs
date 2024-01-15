/** @type {import("next").NextConfig} */
const nextConfig = {
    //output: "export", // Outputs a Single-Page Application (SPA). // disabled so api routes work. revert for cheaper deployment if we decide not to use api routes.
    distDir: "./dist", // Changes the build output directory to `./dist/`.
    
};

export default nextConfig;
