import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export const runtime = "edge";

const bearer_token = "Bearer " + process.env.SERVER_KEY;

const create_lobby_url = new URL("/create", process.env.SERVER_URL);
const destroy_lobby_url = new URL("/destroy", process.env.SERVER_URL);

// creates a new lobby
export async function POST(_request: Request) {
    return fetch(create_lobby_url, {
        method: "GET",
        headers: {
            "Authorization": bearer_token,
        },
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("HTTP status " + response.status);
        }
    }).then((code) => {
        return NextResponse.json({ code });
    }).catch((error) => {
        console.error("Failed to create lobby:", error);
        return NextResponse.json ({ error: "Failed to create lobby" });
    });
}

// destroys an existing lobby
export async function DELETE(_request: Request) {
    fetch(destroy_lobby_url, {
        method: "GET",
        headers: {
            "Authorization": bearer_token,
        },
    }).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("HTTP status " + response.status);
        }
    }).then((code) => {
        return NextResponse.json({ code });
    }).catch((error) => {
        console.error(error);
        return NextResponse.error();
    });
}

// TODO: what is the benefit of protecting the API with a secret key at the server side?
