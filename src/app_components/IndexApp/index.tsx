"use server";

import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("./ClientApp"), { ssr: false });

const IndexApp: React.FC = () => {
    // TODO:ux: routing level i18n including meta tags
    // TODO:other: better data to expose from server (seo)
    // TODO:ux: better looking home page
    return (
        <>
            <h1>Sketch It!</h1>
            <ClientApp />
        </>
    );
};

export default IndexApp;
