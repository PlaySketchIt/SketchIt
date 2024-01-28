import dynamic from "next/dynamic";
import DeferredTranslation from "./DeferredTranslation";

const ClientApp = dynamic(() => import("./ClientApp"), { ssr: false });

const IndexApp: React.FC = () => {
    // could switch to using routed translations in next, but i think this looks cleaner than having separate pages
    // might be better seo, and less pop in, but you have to cope with having the lang code in the url
    return (
        <>
            <h1>
                <DeferredTranslation i18nkey="sketch it!">
                    Sketch It!
                </DeferredTranslation>
            </h1>

            <ClientApp />
        </>
    );
};

export default IndexApp;
