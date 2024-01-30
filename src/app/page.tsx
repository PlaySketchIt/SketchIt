import dynamic from "next/dynamic";

import "@fontsource-variable/open-sans";
import "./page.css";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const IndexApp = dynamic(() => import("../app_roots/IndexApp"));
// TODO:structure: combine components and app_roots to a single directory, just not sure how to structure it yet

interface PageProps {
    session: Session
}

const Page: React.FC<PageProps> = ({ session }) => {
    return (
        <SessionProvider session={session}>
            <IndexApp />
        </SessionProvider>
    );
};

export default Page;
