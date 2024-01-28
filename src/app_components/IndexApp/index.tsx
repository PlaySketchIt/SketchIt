import dynamic from "next/dynamic";
import DeferredTranslation from "./DeferredTranslation";

const ClientApp = dynamic(() => import("./ClientApp"), { ssr: false });

const IndexApp: React.FC = () => {
    return (
        <>
            <h1><DeferredTranslation i18nkey="sketch it!" fallback="Sketch It!" /></h1>
            <ClientApp />
        </>
    );
};

export default IndexApp;
