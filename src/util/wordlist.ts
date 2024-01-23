import i18next from "i18next";

import root_wordlist from "../i18n/en/wordlist.json";

export type Difficulty = "easy" | "medium" | "hard";
const diff_array: Difficulty[] = ["easy", "medium", "hard"];

export interface UntranslatedWord {
    key: string;
    difficulty: Difficulty;
}
export interface Word extends UntranslatedWord {
    translation: string;
}

export interface Wordlist {
    easy_keys: string[];
    medium_keys: string[];
    hard_keys: string[];
}


let wordlist: Wordlist;
let translation_cache: { [key: string]: string } = {};

export const init = () => {
    // load keys from root wordlist
    const easy_keys = Object.keys(root_wordlist.words.easy);
    const medium_keys = Object.keys(root_wordlist.words.medium);
    const hard_keys = Object.keys(root_wordlist.words.hard);

    // load keys into relevant difficulties
    wordlist = {
        easy_keys,
        medium_keys,
        hard_keys,
    };

    // when language changes, clear translation cache
    i18next.on("languageChanged", () => {
        translation_cache = {};
    });
};

export const get_keys = (difficulty?: Difficulty): string[] => {
    if (!difficulty) {
        return [
            ...wordlist.easy_keys,
            ...wordlist.medium_keys,
            ...wordlist.hard_keys,
        ];
    }

    return wordlist[`${difficulty}_keys`];
};

export const get_translation = (word: UntranslatedWord): string => {
    if (translation_cache[word.key]) {
        return translation_cache[word.key];
    }

    const translation = i18next.t(`wordlist:words.${word.difficulty}.${word.key}`);

    translation_cache[word.key] = translation;

    return translation;
};

export const get_random_word = (difficulty?: Difficulty): Word => {
    if (!difficulty) {
        difficulty = diff_array[Math.floor(Math.random() * diff_array.length)];
    }

    const keys = get_keys(difficulty);
    const key = keys[Math.floor(Math.random() * keys.length)];

    const translation = get_translation({
        key,
        difficulty,
    });

    return {
        key,
        translation,
        difficulty,
    };
};

export const find_difficulty = (key: string): Difficulty => {
    if (wordlist.easy_keys.includes(key)) {
        return "easy";
    }

    if (wordlist.medium_keys.includes(key)) {
        return "medium";
    }

    if (wordlist.hard_keys.includes(key)) {
        return "hard";
    }

    throw new Error(`Could not find difficulty for key "${key}"`);
};

export const build_untranslated_word = (key: string): UntranslatedWord => {
    const difficulty = find_difficulty(key);

    return {
        key,
        difficulty,
    };
};
