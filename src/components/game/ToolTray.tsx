import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

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

    on_tool_change: (tool: SketchTool) => void;
    on_radius_change: (radius: number) => void;
    on_tolerance_change: (tolerance: number) => void;
}

const ToolTray: React.FC<ToolTrayProps> = (props) => {
    const { t } = useTranslation();

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
            <ToolTrayOption value="brush" keybind="b" tool_change={setCurrentTool} current_tool={current_tool} />
            <ToolTrayOption value="fill" keybind="f" tool_change={setCurrentTool} current_tool={current_tool} />

            <label
                className="tool-tray-radius-label-container tray-label-container"
                style={{
                    display: current_tool === "brush" ? "flex" : "none",

                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: "calc(var(--tool-box-size) / 5)",
                    fontSize: "calc(var(--tool-box-size) / 3)", // TODO:structure: css var --tray-label-font-size is redundant!

                    width: "calc(var(--tool-box-size) * 2.5)",
                }}
            >
                {t("ui label.brush radius slider")}

                <input
                    className="tool-tray-radius"

                    style={{
                        width: "calc(var(--tool-box-size) * 2)",
                        height: "calc(var(--tool-box-size) / 2)",
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
                    marginLeft: "calc(var(--tool-box-size) / 5)",
                    fontSize: "calc(var(--tool-box-size) / 3)", // TODO:structure: css var --tray-label-font-size is redundant!

                    width: "calc(var(--tool-box-size) * 2.5)",
                }}
            >
                {t("ui label.fill tolerance slider")}

                <input
                    className="tool-tray-tolerance"

                    style={{
                        width: "calc(var(--tool-box-size) * 2)",
                        height: "calc(var(--tool-box-size) / 2)",
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

// TODO:structure: unite labelled slider input into a single component
// TODO:structure: clearer way to represent with components that the slider inputs switch between radius and tolerance
// TODO:feat: double click to reset slider value (do same for alpha). need to save default values somewhere as prop will be overwritten.
// TODO:feat: support key combos? key config?
// TODO:ux: display binds for alpha slider
