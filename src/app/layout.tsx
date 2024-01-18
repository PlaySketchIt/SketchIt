import { Metadata, Viewport } from "next";

import brush_icon from "../assets/icons/brush.svg";

if (!process.env.BASE_URL) {
    throw new Error("BASE_URL environment variable (or .env.local entry) is required, e.g. BASE_URL=https://example.com");
}

let BASE_URL: URL;
try {
    BASE_URL = new URL(process.env.BASE_URL);
} catch (e) {
    throw new Error("BASE_URL environment variable (or .env.local entry) must be a valid URL, e.g. BASE_URL=https://example.com");
}

const BASE_PROTO_HOST = `${BASE_URL.protocol}//${BASE_URL.host}`;

export const viewport: Viewport = {
    themeColor: "#27496e",
};

// TODO:ux: use a metadata generation method to integrate with i18n
export const metadata: Metadata = {
    metadataBase: BASE_URL,

    title: {
        template: "%s | Sketch It!", // TODO:ux: use when required: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
        default: "Sketch It!",
    },
    applicationName: "Sketch It!",

    description: "alan please add details",
    keywords: ["sketch", "drawing", "canvas", "web", "app", "game", "multiplayer", "pictionary", "scribble"],
    category: "games",

    authors: [
        {
            name: "obfuscatedgenerated",
            url: "https://ollieg.codes"
        }
    ],
    creator: "obfuscatedgenerated",

    icons: {
        icon: [
            { url: brush_icon.src },
        ],
        shortcut: [brush_icon.src],
        apple: [
            { url: brush_icon.src },
        ],
    },

    openGraph: {
        locale: "en_GB",
        type: "website",
        url: BASE_PROTO_HOST,
        siteName: "Sketch It!",
        images: [
            {
                url: brush_icon.src,
                width: 512,
                height: 512,
                alt: "Sketch It! (logo)", // TODO:ux: proper og images
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        // site: "@site_account",
        // siteId: "@site_account",
        // creator: "@creator_account",
        // creatorId: "@creator_account", // TODO:other: fill out? could also link to mastodon account
        images: [brush_icon.src], // TODO:ux: proper twitter card images
    },

    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
