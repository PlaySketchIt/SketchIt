import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sketch It!",
    description: "alan please add details"
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/svg+xml" href="/pen.svg" /> {/** TODO: replace with next automatic image bundling */}
            </head>
            <body>
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
