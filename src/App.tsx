import "./App.css";
import "./App.media.css";
import SketchArea from "./components/SketchArea";

// dimensions affect image size. viewport size should be applied to sketch area, and canvas will scale to fit it
const WIDTH = 1280;
const HEIGHT = 720;

function App() {
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

          scroll_step={1} // TODO: separate scroll wheel step from input knob step?

          pressure_modifier={5} // TODO: could be user defined. perhaps by a nice curve editor?

          undo_steps={50} // TODO: should this be limited? don't want to be using loads of memory in the background if the user does more than 50 things. each step is a full canvas image. profiling shows that 50 steps uses ~110MB of memory, so it's not too bad but still a bit
        />
    </>
  );
}

export default App;

// radius values are now with respect to the canvas size, so should be consistent across screen sizes

// TODO: i18n integration
// TODO: remove as much inline styling as possible so it can be overridden without !important, unless strictly necessary or dynamic.
// TODO: remove keybind labels from buttons on mobile

// monetisation ideas:
// - ad frames (blegh)
// - donation panel (maybe)
// - premium plan (depends how i do it)
// - merch shop (maybe)
// - artist pay to promote their commissions on the sidebar (could be great, but needs demand and a good system in place)
// - sponsorship from drawing tablet companies (could work once popular enough) or some form of amazon affiliate link (not sure how successful this would be)
// - dont monetise and just open source it (not ideal but im open to it, but i wouldnt host it myself)

