"use client";

import { useState } from "react";

import Link from "next/link";

export default function Page() {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");


    return (
        <>
            <label>
                Lobby Code:

                <input
                    type="text"
                    placeholder="Enter lobby code"

                    minLength={10}
                    maxLength={10}

                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                />
            </label>

            <label>
                Username:

                <input
                    type="text"
                    placeholder="Enter username"

                    minLength={1}
                    maxLength={16}

                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </label>

            <Link href = {{
                pathname: "/game",
                query: {
                    code,
                    name,
                }
            }}>
                Join
            </Link>
        </>
    );
}

// TODO:ux: improve ui
// TODO:structure: sync min and max lengths with server

