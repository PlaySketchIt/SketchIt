"use client";

import * as si18n from "../../util/setup_i18n";
import i18n from "i18next";

import { useState, useEffect } from "react";

export interface DeferredTranslationProps {
    i18nkey: string;
    children?: React.ReactNode;
    ns?: string;
}

const DeferredTranslation: React.FC<DeferredTranslationProps> = (props) => {
    const [translation, setTranslation] = useState(props.children);

    useEffect(() => {
        si18n.init();
    }, []);

    useEffect(() => {
        const ready_handler = () => {
            setTranslation(i18n.t(props.i18nkey, { ns: props.ns }));
        };

        si18n.on_ready(() => {
            // set up listener for language changes
            i18n.on("languageChanged", ready_handler);

            // call handler once to set initial translation
            ready_handler();
        });

        // remove listeners i18nkey or ns changes or component unmounts
        return () => {
            i18n.off("languageChanged", ready_handler);
            si18n.off_ready(ready_handler);
        };
    }, [props.i18nkey, props.ns]);

    return <>{translation}</>;
};

export default DeferredTranslation;
