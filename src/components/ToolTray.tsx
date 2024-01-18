import { useEffect, useState } from "react";

import { SketchTool } from "./SketchCanvas";
import ToolTrayOption from "./ToolTrayOption";

export interface ToolTrayProps {
    init_tool: SketchTool;

    min_radius: number;
    max_radius: number;
    brush_radius: number;
    radius_step: number;

    min_tolerance?: number;
    max_tolerance?: number;
    fill_tolerance: number;
    tolerance_step: number;

    tool_box_size_vw?: number;

    on_tool_change: (tool: SketchTool) => void;
    on_radius_change: (radius: number) => void;
    on_tolerance_change: (tolerance: number) => void;
}

const ToolTray: React.FC<ToolTrayProps> = (props) => {
    const tool_box_size_vw = props.tool_box_size_vw ?? 2.5;

    const min_tolerance = props.min_tolerance ?? 0;
    const max_tolerance = props.max_tolerance ?? 254;

    const [current_tool, setCurrentTool] = useState<SketchTool>(props.init_tool);

    // have to destructure for effects. passing props.on_tool_change isn't working and passing whole props is inefficient
    const { on_tool_change } = props;

    // effect: callback when value changes
    useEffect(() => {
        on_tool_change(current_tool);
    }, [current_tool, on_tool_change]);

    return (
        <div className="tool-tray tray"
            style={{
                display: "flex",
                flexDirection: "row",

                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <ToolTrayOption value="brush" keybind="b" box_size_vw={tool_box_size_vw} tool_change={setCurrentTool} current_tool={current_tool} />
            <ToolTrayOption value="fill" keybind="f" box_size_vw={tool_box_size_vw} tool_change={setCurrentTool} current_tool={current_tool} />

            <label
                className="tool-tray-radius-label-container tray-label-container"
                style={{
                    display: current_tool === "brush" ? "flex" : "none",

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: `${tool_box_size_vw / 5}vw`,
                    fontSize: `${tool_box_size_vw / 3}vw`,

                    width: `${tool_box_size_vw * 2.5}vw`, // consistent with so no shift when changing tool
                    // TODO: check calculation works at different viewport sizes
                }}
            >
                Brush Radius:

                <input
                    className="tool-tray-radius"

                    style={{
                        width: `${tool_box_size_vw * 2}vw`,
                        height: `${tool_box_size_vw / 2}vw`
                    }}

                    type="range"

                    min={props.min_radius}
                    max={props.max_radius}
                    step={props.radius_step}
                    value={props.brush_radius}

                    onChange={(e) => props.on_radius_change(e.target.valueAsNumber)}
                />
            </label>

            <label
                className="tool-tray-tolerance-label-container tray-label-container"
                style={{
                    display: current_tool === "fill" ? "flex" : "none",

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: `${tool_box_size_vw / 5}vw`,
                    fontSize: `${tool_box_size_vw / 3}vw`,

                    width: `${tool_box_size_vw * 2.5}vw` // consistent with so no shift when changing tool
                    // TODO: check calculation works at different viewport sizes
                }}
            >
                Fill Tolerance:

                <input
                    className="tool-tray-tolerance"

                    style={{
                        width: `${tool_box_size_vw * 2}vw`,
                        height: `${tool_box_size_vw / 2}vw`
                    }}

                    type="range"

                    min={min_tolerance}
                    max={max_tolerance}
                    step={props.tolerance_step}
                    value={props.fill_tolerance}

                    onChange={(e) => props.on_tolerance_change(e.target.valueAsNumber)}
                />
            </label>
        </div>
    );
};

export default ToolTray;

// TODO: unite labelled slider input into a single component
// TODO: clearer input switch mechanism
// TODO: double click to reset slider value (do same for alpha). need to save default values somewhere as prop will be overwritten.
// TODO: configurable keybinds. support key combos?
// TODO: bind for alpha slider
