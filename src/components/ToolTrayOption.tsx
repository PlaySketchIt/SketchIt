import Image from "next/image";

import { SketchTool } from "./SketchCanvas";
import useKeyHandler from "../hooks/useKeyHandler";

import brush_icon from "../assets/icons/brush.svg";
import fill_icon from "../assets/icons/fill.svg";

const tool_icons = {
    "brush": brush_icon.src,
    "fill": fill_icon.src
};

export interface ToolTrayOptionProps {
    value: SketchTool;
    box_size_vw?: number;

    current_tool: SketchTool;

    tool_change: (tool: SketchTool) => void;

    keybind: string;
}

const ToolTrayOption: React.FC<ToolTrayOptionProps> = (props) => {
    useKeyHandler(() => { if (props.current_tool !== props.value) props.tool_change(props.value); }, props.keybind);

    const classes = props.value === props.current_tool ? "tool-tray-option tool-tray-option-selected tray-option tray-option-selected" : "tool-tray-option tray-option";

    const box_size_vw = props.box_size_vw ?? 2.5;

    return (
        <button
            className={classes}

            style={{
                width: `${box_size_vw}vw`,
                aspectRatio: 1,

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

                style ={{
                    position: "absolute",

                    bottom: `${box_size_vw * 0.1}vw`,
                    left: `${box_size_vw * 0.1}vw`,

                    width: "55%",
                    height: "55%", // TODO: i'm not a huge fan of the reduced scale icons, but it makes the keybinds more visible. maybe make the keybinds part of the icon then this can be reverted. or perhaps toggleable?
                }}

                // rendered size. not the same as viewport size. //TODO: adjust reasonably, otherwise no point using svg
                width={box_size_vw}
                height={box_size_vw}

                aria-hidden="true"
                alt=""

                draggable={false}

                src={tool_icons[props.value]}
            />
            <kbd
                className="tray-option-keybind tool-tray-option-keybind"
                style={{
                    position: "absolute",
                    top: `${box_size_vw / 40}vw`,
                    right: `${box_size_vw / 40}vw`,

                    fontSize: `${box_size_vw / 3.5}vw`,
                    fontFamily: "monospace",
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
