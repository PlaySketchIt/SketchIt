import { useEffect } from "react";

const useKeyHandler = (callback: () => void, key?: string) => {
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (!key) {
                callback();
                return;
            }

            if (event.key === key) {
                callback();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [callback, key]);
};

export default useKeyHandler;

// TODO: handle key combinations?
// TODO: proper handler for held down keys. specifiable interval? would be useful for alpha
