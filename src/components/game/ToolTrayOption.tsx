import Image from "next/image";

import { useTranslation } from "react-i18next";

import { SketchTool } from "./SketchCanvas";
import useKeyHandler from "../../hooks/useKeyHandler";

import brush_icon from "../../assets/icons/brush.svg";
import fill_icon from "../../assets/icons/fill.svg";

const tool_icons = {
    "brush": brush_icon.src,
    "fill": fill_icon.src
};

export interface ToolTrayOptionProps {
    value: SketchTool;
    current_tool: SketchTool;
    tool_change: (tool: SketchTool) => void;
    keybind: string;
}

const ToolTrayOption: React.FC<ToolTrayOptionProps> = (props) => {
    const { t } = useTranslation();

    useKeyHandler(() => { if (props.current_tool !== props.value) props.tool_change(props.value); }, props.keybind);

    const classes = props.value === props.current_tool ? "tool-tray-option tool-tray-option-selected tray-option tray-option-selected" : "tool-tray-option tray-option";

    return (
        <button
            className={classes}

            style={{
                width: "var(--tool-box-size)",
                aspectRatio: 1,

                padding: 0,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                position: "relative"
            }}

            // TODO:ux: should these be fully self contained strings? will order change in some languages if tool name is different?
            // TODO:structure: clean up
            aria-label={t(props.current_tool === props.value ? "aria label.select tool current" : "aria label.select tool", { tool: t("tool." + props.value), key: props.keybind })}
            data-tooltip={t("tooltip.click to select tool", { tool: t("tool." + props.value) })}

            onClick={() => props.tool_change(props.value)}
        >
            <Image
                className="tray-option-icon tool-tray-option-icon"

                style ={{
                    position: "absolute",

                    bottom: "calc(var(--tool-box-size) / 10)",
                    left: "calc(var(--tool-box-size) / 10)",

                    width: "55%",
                    height: "55%", // TODO:ux: i'm not a huge fan of the reduced scale icons, but it makes the keybinds more visible. maybe make the keybinds part of the icon then this can be reverted. or perhaps toggleable?
                }}

                // TODO:ux: calculate good render size (width and height props directly on image). or see if it supports svg properly?
                width={250}
                height={250}

                aria-hidden="true"
                alt=""

                draggable={false}

                src={tool_icons[props.value]}
            />
            <kbd
                className="tray-option-keybind tool-tray-option-keybind"
                style={{
                    position: "absolute",
                    top: "calc(var(--tool-box-size) / 40)",
                    right: "calc(var(--tool-box-size) / 40)",

                    fontSize: "calc(var(--tool-box-size) / 3.5)",
                }}

                aria-hidden="true"
            >
                {props.keybind}
            </kbd>
        </button>
    );
};

export default ToolTrayOption;

// TODO:structure: unify with color and command tray option

