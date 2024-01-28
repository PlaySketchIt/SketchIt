import { createContext } from "react";

import type { Socket } from "socket.io-client";

export interface IConnectionCtx {
    username: string;
    code: string;

    socket: Socket;
}

const ConnectionContext = createContext<IConnectionCtx | null>(null);

export default ConnectionContext;
