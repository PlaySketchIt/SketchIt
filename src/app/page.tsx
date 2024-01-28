import dynamic from "next/dynamic";

import "@fontsource-variable/open-sans";
import "./page.css";
 
const IndexApp = dynamic(() => import("../app_roots/IndexApp"), { ssr: true });
// TODO:structure: combine components and app_roots to a single directory, just not sure how to structure it yet
 
const Page = () => {
    return <IndexApp />;
};

export default Page;
