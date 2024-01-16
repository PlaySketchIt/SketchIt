import { Metadata, Viewport } from "next";

import pen_icon from "../assets/icons/pen.svg";

const BASE_URL = "https://localhost:3000"; // TODO: replace with domain when deployed

export const viewport: Viewport = {
    themeColor: "#27496e",
};

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),

    title: {
        template: "%s | Sketch It!", // TODO: use when required: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
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
            { url: pen_icon.src },
        ],
        shortcut: [pen_icon.src],
        apple: [
            { url: pen_icon.src },
        ],
    },

    openGraph: {
        locale: "en_GB",
        type: "website",
        url: BASE_URL,
        siteName: "Sketch It!",
        images: [
            {
                url: pen_icon.src,
                width: 512,
                height: 512,
                alt: "Sketch It! (logo)", // TODO: proper og images
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        // site: "@site_account",
        // siteId: "@site_account",
        // creator: "@creator_account",
        // creatorId: "@creator_account", // TODO: fill out? could also link to mastodon account
        images: [pen_icon.src], // TODO: proper twitter card images
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
