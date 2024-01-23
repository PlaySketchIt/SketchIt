import i18next from "i18next";

let wordlist: { [key: string]: string } = {};

export const init = () => {
    wordlist = i18next.t("wordlist:words", { returnObjects: true });

    // when language changes, update wordlist
    i18next.on("languageChanged", () => {
        wordlist = i18next.t("wordlist:words", { returnObjects: true });
    });
};

export const translate = (key: string) => {
    return wordlist[key] || key;
};

export const get_random_key = () => {
    const keys = get_keys();
    return keys[Math.floor(Math.random() * keys.length)];
};

export const get_keys = () => {
    return Object.keys(wordlist);
};

export const get_values = () => {
    return Object.values(wordlist);
};

export const get_wordlist = () => {
    return wordlist;
};
