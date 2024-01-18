"use client";

import Link from "next/link";

export const runtime = "edge";

const NotFound = () => {
    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
        </div>
    );
};

export default NotFound;
