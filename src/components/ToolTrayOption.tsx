import Image from "next/image";

import { SketchTool } from "./SketchCanvas";
import useKeyHandler from "../hooks/useKeyHandler";

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

    keybind: string;
}

const ToolTrayOption: React.FC<ToolTrayOptionProps> = (props) => {
    useKeyHandler(() => { if (props.current_tool !== props.value) props.tool_change(props.value); }, props.keybind);

    const classes = props.value === props.current_tool ? "tool-tray-option tool-tray-option-selected tray-option tray-option-selected" : "tool-tray-option tray-option";

    return (
        <button
            className={classes}

            style={{
                width: props.size ?? 20,
                height: props.size ?? 20,

                padding: 0,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                position: "relative"
            }}

            aria-label={`select ${props.value} tool${props.current_tool === props.value ? " (current)" : ""} [keybind: ${props.keybind}]`}

            onClick={() => props.tool_change(props.value)}
        >
            <Image
                className="tray-option-icon tool-tray-option-icon"

                width={(props.size ?? 20) * 0.75}
                height={(props.size ?? 20) * 0.75}

                aria-hidden="true"
                alt=""

                draggable={false}

                src={tool_icons[props.value]}
            />
            <kbd
                className="tray-option-keybind tool-tray-option-keybind"
                style={{
                    position: "absolute",
                    top: 0,
                    right: 1 // TODO: better keyboard style
                }}

                aria-hidden="true"
            >
                {props.keybind}
            </kbd>
        </button>
    );
};

export default ToolTrayOption;

// TODO: unify with color and command tray option
// TODO: hotkeys
// TODO: hotkeys for opacity control
