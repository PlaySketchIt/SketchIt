"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const GameApp = dynamic(() => import("../GameApp"), { ssr: false });

interface InputFormProps {
    on_submit: (name: string, code: string) => void;
}

const InputForm: React.FC<InputFormProps> = (props) => {
    const [username, setUsername] = useState("");
    const [code, setCode] = useState("");

    return (
        <>
            <label htmlFor="inp-name">Name</label>
            <input id="inp-name" onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="inp-code">Code</label>
            <input id="inp-code" onChange={(e) => setCode(e.target.value)} />

            <button onClick={() => props.on_submit(username, code)}>Submit</button>
        </>
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
