"use client";

import "./GameApp.css";
import "./GameApp.media.css";

import { useEffect, useMemo } from "react";

import { init as init_i18n } from "../../util/setup_i18n";

init_i18n();
import i18n from "i18next";

import Swal from "sweetalert2";

import { io } from "socket.io-client";

import ConnectionContext, { IConnectionCtx } from "./ConnectionContext";
import SketchArea from "../../components/game/SketchArea";

// dimensions affect image size. viewport size should be applied to sketch area, and canvas will scale to fit it
const WIDTH = 1280;
const HEIGHT = 720;

const setup_conn_ctx = (username: string, code: string): IConnectionCtx => {
  console.log("Setting up connection context");

  // TODO:ux: server picker
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new Error("No server url configured");
  }

  if (code === "!TESTMODE!") {
    console.warn("Running in test mode. Socket will not be defined.");
    // TODO:other: better way to do this, or just remove it. we don't want to check if socket is defined everywhere.
    return {
      username,
      code,
    };
  }

  //// erase params from url in navbar
  //url.searchParams.delete("name");
  //url.searchParams.delete("code");
  //window.history.replaceState({}, "", url.toString());
  // TODO:other: removed so client may reload page and still be in the same lobby. is this important?

  // TODO:structure: sync with server, or just remove this client side check?
  // TODO:ux: better error, with proper modal

  // setup socket
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL,
    {
      autoConnect: false,
      query: {
        username,
        code,
      }
    }
  );

  // add error handlers
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
    socket.disconnect();

    let err_msg = "connection error.unknown";
    if (err.message.startsWith("user:")) {
      err_msg = err.message.replace("user:", "connection error.user.");
    }

    Swal.fire({
      title: i18n.t("connection error.title"),
      text: i18n.t(err_msg),
      icon: "error",

      confirmButtonText: i18n.t("connection error.return home"),
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO:ux: proper reset without reload
        window.location.reload();
      }
    });
  });

  // TODO:ux: better error handling with proper modals

  socket.on("connect_timeout", (timeout) => {
    console.error("Connection timeout:", timeout);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });

  socket.on("disconnect", (reason) => {
    console.error("Socket disconnected:", reason);
  });

  socket.on("reconnect_attempt", (attempt) => {
    console.log("Attempting to reconnect:", attempt);
  });

  // attempt to connect
  try {
    socket.connect();
  } catch (err) {
    throw new Error("Failed to connect to server");
  }

  return {
    socket,
    username,
    code,
  };
};
// TODO:safety: this whole function is a bit janky, especially the error handling. should be cleaned up and handle reloads properly

export interface GameAppProps {
  username: string;
  code: string;
}

const GameApp: React.FC<GameAppProps> = (props) => {
  const conn_ctx = useMemo(() => setup_conn_ctx(props.username, props.code), [props.username, props.code]);

  // effect: disconnect on unmount
  useEffect(() => {
    // cleanup
    return () => {
      if (conn_ctx && conn_ctx.socket) { // not checking if connected since we also want to stop any pending connections
        console.log("Disconnecting socket for cleanup");
        conn_ctx.socket.disconnect();
        // TODO:safety: do we need to signal to the game code that the socket is disconnected / conn_ctx changed?
      }
    };
  }, [conn_ctx]);

  return (
    <ConnectionContext.Provider value={conn_ctx}>
      <SketchArea
        background="#fff"

        width={WIDTH}
        height={HEIGHT}

        min_radius={2}
        max_radius={25}
        brush_radius={5}

        fill_tolerance={40}

        scroll_step={1} // TODO:lib: separate scroll wheel step from input knob step?

        pressure_modifier={5} // TODO:feat: could be user defined. perhaps by a nice curve editor?

        undo_steps={50} // TODO:ux: should this be limited? don't want to be using loads of memory in the background if the user does more than 50 things. each step is a full canvas image. profiling shows that 50 steps uses ~110MB of memory, so it's not too bad but still a bit
      />
    </ConnectionContext.Provider>
  );
};

export default GameApp;

// radius values are now with respect to the canvas size, so should be consistent across screen sizes

// TODO:ux: i18n integration
// TODO:structure: remove as much inline styling as possible so it can be overridden without !important, unless strictly necessary or dynamic.
// TODO:ux: remove keybind labels from buttons on mobile
// TODO:perf: should some effects dependent on prop/state changes be removed? seems more efficient to use them but perhaps that's not the case: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
// TODO:ux: input sizing and picker swatch shape not consistent on ios safari, because of course it isnt. border dashing is thinner on ios too
// TODO:ux: don't bother using dyncursor if device is touch screen
// TODO:ux: toggleable tooltips / mode to make them less verbose (i.e. "click to select color: red" -> "red")
// TODO:structure: make i18n keys in en-gb so less confusing that the default en locale is en-gb
// TODO:perf: should i18n values be precomputed and changed if language changes? would it make a difference?
// TODO:feat: language changer

// monetisation ideas:
// - ad frames (blegh)
// - donation panel (maybe)
// - premium plan (depends how i do it)
// - merch shop (maybe)
// - artist pay to promote their commissions on the sidebar (could be great, but needs demand and a good system in place)
// - sponsorship from drawing tablet companies (could work once popular enough) or some form of amazon affiliate link (not sure how successful this would be)
// - dont monetise and just open source it (not ideal but im open to it, but i wouldnt host it myself)

