import resourcesToBackend from "i18next-resources-to-backend";
import "./GameApp.css";
import "./GameApp.media.css";
import SketchArea from "../../components/SketchArea";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

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

function GameApp() {
  return (
    <>
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
    </>
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

