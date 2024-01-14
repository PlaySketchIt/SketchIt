import { useState } from "react";

import { SketchTool } from "./SketchCanvas";
import ToolTrayOption from "./ToolTrayOption";

export interface ToolTrayProps {
    init_tool: SketchTool;

    min_radius: number;
    max_radius: number;
    pen_radius: number;
    radius_step: number;

    tool_box_size?: number;

    on_tool_change: (tool: SketchTool) => void;
    on_radius_change: (radius: number) => void;
}

const ToolTray: React.FC<ToolTrayProps> = (props) => {
    const tool_box_size = props.tool_box_size ?? 40;

    const [current_tool, setCurrentTool] = useState(props.init_tool);

    const on_tool_change = (tool: SketchTool) => {
        setCurrentTool(tool);
        props.on_tool_change(tool);
    };

    return (
        <div className="tool-tray"
            style={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            <ToolTrayOption value="pen" size={tool_box_size} tool_change={on_tool_change} current_tool={current_tool} />
            <ToolTrayOption value="fill" size={tool_box_size} tool_change={on_tool_change} current_tool={current_tool} />

            <label
                className="tool-tray-radius-label-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: tool_box_size / 10,
                }}
            >
                Radius:

                <input
                    className="tool-tray-radius"

                    style={{
                        width: tool_box_size * 2,
                        height: tool_box_size / 2,

                        border: "2px solid black",
                    }}

                    type="range"

                    min={props.min_radius}
                    max={props.max_radius}
                    step={props.radius_step}
                    value={props.pen_radius}

                    onChange={(e) => props.on_radius_change(e.target.valueAsNumber)}
                />
            </label>
        </div>
    );
};

export default ToolTray;
