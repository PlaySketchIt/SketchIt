import { useState } from "react"

import "./App.css"
import SketchCanvas from "./components/SketchCanvas"

function App() {
  return (
    <>
      <SketchCanvas
        init_bg="blue"

        min_radius={1.5}
        max_radius={15}
        scroll_step={0.5}
      />
    </>
  )
}

export default App
