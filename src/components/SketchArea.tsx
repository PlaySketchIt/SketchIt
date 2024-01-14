import { useState } from "react";

import SketchCanvas, { SketchCanvasProps, SketchTool } from "./SketchCanvas";
import ColorTray from "./ColorTray";
import ToolTray from "./ToolTray";

export interface SketchAreaProps extends Omit<SketchCanvasProps, "fg_color" | "current_tool"> {
    scroll_step?: number;
    tool_box_size?: number;
}

const SketchArea: React.FC<SketchAreaProps> = (props) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const [pen_radius, setPenRadius] = useState(props.pen_radius);
    const [fg_color, setFgColor] = useState("#000000");
    const [current_tool, setCurrentTool] = useState<SketchTool>("pen");

    const scroll_step = props.scroll_step ?? 1;

    const on_scroll_wheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (current_tool === "fill") return;

        e.stopPropagation();

        const delta = -e.deltaY;
        const new_radius = pen_radius + delta / 100 * scroll_step;

        if (new_radius < min_radius || new_radius > max_radius) return;
        console.log(new_radius);

        setPenRadius(new_radius);
    };

    return (
        <div className="sketch-area" onWheel={on_scroll_wheel}>
            <SketchCanvas
                init_bg={props.init_bg}

                fg_color={fg_color}

                current_tool={current_tool}

                width={props.width}
                height={props.height}

                min_radius={min_radius}
                max_radius={max_radius}
                pen_radius={pen_radius}

                pressure_sensitive={props.pressure_sensitive}
            />
            <div
                className="sketch-trays"
                style={{
                    display: "flex",
                    flexDirection: "row",

                    gap: (props.tool_box_size ?? 40) * 1.5,
                }}
            >
                <ColorTray
                    init_color={fg_color}
                    on_color_change={setFgColor}
                    tool_box_size={props.tool_box_size}
                />
                <ToolTray
                    init_tool={current_tool}
                    on_tool_change={setCurrentTool}
                    tool_box_size={props.tool_box_size}
                />
            </div>
        </div>
    );
};

export default SketchArea;

// TODO: use viewport units
