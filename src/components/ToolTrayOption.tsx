import { SketchTool } from "./SketchCanvas";

import pen_icon from "../assets/icons/pen.svg";
import fill_icon from "../assets/icons/fill.svg";

const tool_icons = {
    "pen": pen_icon.src,
    "fill": fill_icon.src
};

export interface ToolTrayOptionProps {
    value: SketchTool;
    size?: number;

    current_tool: SketchTool;

    tool_change: (tool: SketchTool) => void;
}

const ToolTrayOption: React.FC<ToolTrayOptionProps> = (props) => {
    const classes = props.value === props.current_tool ? "tool-tray-option tool-tray-option-selected tray-option tray-option-selected" : "tool-tray-option tray-option";

    return (
        <button
            className={classes}

            style={{
                backgroundImage: `url(${tool_icons[props.value]})`,

                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            aria-label={"select " + props.value + " tool"}

            onClick={() => props.tool_change(props.value)}
        >
        </button>
    );
};

export default ToolTrayOption;

// TODO: unify with color and command tray option
// TODO: hotkeys
// TODO: hotkeys for opacity control
