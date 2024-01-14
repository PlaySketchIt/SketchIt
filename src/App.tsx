import "./App.css";
import SketchArea from "./components/SketchArea";

function App() {
  return (
    <>
        <SketchArea
          init_bg="white"

          width={800}
          height={450}

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
