import "./App.css";
import SketchArea from "./components/SketchArea";

// dimensions affect image size. viewport size should be applied to sketch area, and canvas will scale to fit it
const WIDTH = 1280;
const HEIGHT = 720;

// TODO: manage canvas vs viewport width. canvas width is image data size so should be consistent, but we can resize it to fit the viewport
// TODO: mobile layout. i like the way skribbl does it compared to gartic's scrolling canvas (which nobody realises exists)

function App() {
  return (
    <>
        <SketchArea
          background="#fff"

          width={WIDTH}
          height={HEIGHT}

          min_radius={1.5}
          max_radius={20}
          brush_radius={5}

          fill_tolerance={40}

          scroll_step={0.5}

          pressure_modifier={5} // TODO: could be user defined. perhaps by a nice curve editor?

          tool_box_size_vw={2.5}

          undo_steps={50} // TODO: should this be limited? don't want to be using loads of memory in the background if the user does more than 50 things. each step is a full canvas image. profiling shows that 50 steps uses ~110MB of memory, so it's not too bad but still a bit
        />
    </>
  );
}

export default App;

// TODO: i18n integration

// monetisation ideas:
// - ad frames (blegh)
// - donation panel (maybe)
// - premium plan (depends how i do it)
// - merch shop (maybe)
// - artist pay to promote their commissions on the sidebar (could be great, but needs demand and a good system in place)
// - sponsorship from drawing tablet companies (could work once popular enough) or some form of amazon affiliate link (not sure how successful this would be)
// - dont monetise and just open source it (not ideal but im open to it, but i wouldnt host it myself)
