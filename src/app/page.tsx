import dynamic from "next/dynamic";

import "@fontsource-variable/open-sans";
import "./page.css";
 
const IndexApp = dynamic(() => import("../app_components/IndexApp"), { ssr: true });
 
const Page = () => {
    return <IndexApp />;
};

export default Page;
