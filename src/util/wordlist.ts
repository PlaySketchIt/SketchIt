import i18next from "i18next";

import root_wordlist from "../i18n/en/wordlist.json";

// TODO:structure: would it be cleaner if this was a union type?
export enum Difficulty {
    EASY,
    MEDIUM,
    HARD,
}
const N_DIFFICULTIES = 3;

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
    switch (difficulty) {
        case undefined:
            return [
                ...wordlist.easy_keys,
                ...wordlist.medium_keys,
                ...wordlist.hard_keys,
            ];
        case Difficulty.EASY:
            return wordlist.easy_keys;
        case Difficulty.MEDIUM:
            return wordlist.medium_keys;
        case Difficulty.HARD:
            return wordlist.hard_keys;
    }
};

export const get_translation = (word: UntranslatedWord): string => {
    if (translation_cache[word.key]) {
        return translation_cache[word.key];
    }

    const translation = i18next.t(`wordlist:words.${Difficulty[word.difficulty]}.${word.key}`);

    translation_cache[word.key] = translation;

    return translation;
};

export const get_random_word = (difficulty?: Difficulty): Word => {
    if (!difficulty) {
        difficulty = Math.floor(Math.random() * N_DIFFICULTIES);
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
