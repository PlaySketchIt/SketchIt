"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GameApp = dynamic(() => import("../GameApp"), { ssr: false });

import Swal from "sweetalert2";

interface InputFormProps {
    on_submit: (name: string, code: string) => void;
}

const InputForm: React.FC<InputFormProps> = (props) => {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    const submit = () => {
        // TODO:other: could ask server for valid lengths rather than having to keep them in sync here

        if (username.length < 1 || username.length > 16) {
            Swal.fire({
                title: "Invalid username",
                text: "Username must be between 1 and 16 characters",
                icon: "error",
            });

            return;
        }

        if (code.length !== 10) {
            Swal.fire({
                title: "Invalid code",
                text: "Code must be exactly 10 characters",
                icon: "error",
            });

            return;
        }

        // save username and code to localstorage
        localStorage.setItem("username", username);
        localStorage.setItem("code", code);

        props.on_submit(username, code);
    };

    // effect: populate code field with url param OR localstorage value
    useEffect(() => {
        const url = new URL(window.location.href);
        const url_code = url.searchParams.get("code");

        if (url_code) {
            setCode(url_code);
        } else if (localStorage.getItem("code")) {
            setCode(localStorage.getItem("code") as string);
        }
    }, []);

    // effect: populate username field with localstorage value
    useEffect(() => {
        if (localStorage.getItem("username")) {
            setUsername(localStorage.getItem("username") as string);
        }
    }, []);

    return (
        <div className="input-form">
            <label htmlFor="inp-username">Username</label>
            <input id="inp-username" minLength={1} maxLength={16} defaultValue={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="inp-code">Code</label>
            <input id="inp-code" minLength={10} maxLength={10} defaultValue={code} onChange={(e) => setCode(e.target.value)} />

            <button onClick={submit}>Join</button>
        </div>
    );
};

// TODO:perf: dedupe state

const ClientApp: React.FC = () => {
    const [game, setGame] = useState(false);

    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    if (game) {
        return <GameApp username={username} code={code} />;
    } else {
        return (
            <InputForm on_submit={(username, code) => {
                setUsername(username);
                setCode(code);

                setGame(true);
            }} />
        );
    }
};

export default ClientApp;
