import "./GameApp.css";
import "./GameApp.media.css";

import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { io } from "socket.io-client";

import ConnectionContext, { IConnectionCtx } from "./ConnectionContext";
import SketchArea from "../../components/SketchArea";


// setup i18n
i18n
  .use(resourcesToBackend((lng: string, ns: string) => import(`../../i18n/${lng}/${ns}.json`)))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false, // react already handles this
    },

    ns: ["game", "wordlist"],

    lowerCaseLng: true,
    nonExplicitSupportedLngs: true,
    fallbackLng: {
      default: ["en-GB"],
    }
  });

// dimensions affect image size. viewport size should be applied to sketch area, and canvas will scale to fit it
const WIDTH = 1280;
const HEIGHT = 720;

const setup_conn_ctx = (): IConnectionCtx => {
  console.log("Setting up connection context");

  // TODO:ux: server picker
  if (!process.env.NEXT_PUBLIC_SERVER_URL) {
    throw new Error("No server url configured");
  }

  // read name and code from query params
  const url = new URL(window.location.href);

  const username = url.searchParams.get("name");
  const code = url.searchParams.get("code");

  //// erase params from url in navbar
  //url.searchParams.delete("name");
  //url.searchParams.delete("code");
  //window.history.replaceState({}, "", url.toString());
  // TODO:other: removed so client may reload page and still be in the same lobby. is this important?

  // TODO:structure: sync with server, or just remove this client side check?
  // TODO:ux: better error, with proper modal
  if (!username || !code || username.length < 1 || username.length > 16 || code.length !== 10) {
    throw new Error("Invalid name or code");
  }

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
  // TODO:ux: better error handling with proper modals
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });

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
    console.log("Connected to server");
  } catch (err) {
    throw new Error("Failed to connect to server");
  }

  return {
    socket,
    username,
    code,
  };
};

const conn_ctx = setup_conn_ctx();

function GameApp() {
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
}

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

