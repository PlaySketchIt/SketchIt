import "./App.css";
import SketchArea from "./components/SketchArea";

const ASPECT_RATIO = 16 / 9;
const WIDTH = 1000;

// TODO: manage canvas vs viewport width. canvas width is image data size so should be consistent, but we can resize it to fit the viewport
// TODO: mobile layout. i like the way skribbl does it compared to gartic's scrolling canvas (which nobody realises exists)

function App() {
  return (
    <>
        <SketchArea
          background="white"

          width={WIDTH}
          height={WIDTH / ASPECT_RATIO}

          min_radius={1.5}
          max_radius={15}
          pen_radius={5}

          scroll_step={0.5}

          pressure_sensitive={true}

          tool_box_size={40}
        />
    </>
  );
}

export default App;

// TODO: i18n integration
