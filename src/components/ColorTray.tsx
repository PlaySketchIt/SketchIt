import { useState } from "react";
import Image from "next/image";

import ColorTrayOption from "./ColorTrayOption";

import picker_icon from "../assets/icons/picker.svg";

export interface ColorTrayProps {
    init_color: string;
    init_alpha?: number;
    tool_box_size?: number;
    on_color_change: (color: string) => void;
    on_alpha_change: (alpha: number) => void;
}

const ColorTrayRow: React.FC<{ children?: React.ReactNode }> = (props) => {
    return (
        <div
            className="color-tray-row"
            style={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            {props.children}
        </div>
    );
};

const calculate_luminance = (color: string) => {
    // https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
    const r = parseInt(color.substring(1, 3), 16) / 255;
    const g = parseInt(color.substring(3, 5), 16) / 255;
    const b = parseInt(color.substring(5, 7), 16) / 255;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ColorTray: React.FC<ColorTrayProps> = (props) => {
    const tool_box_size = props.tool_box_size ?? 40;
    const color_box_size = tool_box_size / 2;

    const [current_color, setCurrentColor] = useState(props.init_color);
    const [current_alpha, setCurrentAlpha] = useState(props.init_alpha ?? 1);

    const picker_invert_value = calculate_luminance(current_color) > 0.5 ? "0%" : "100%"; // TODO: configurable threshold + shadow amount.

    const on_color_change = (color: string) => {
        setCurrentColor(color);
        props.on_color_change(color);
    };

    const on_alpha_change = (alpha: number) => {
        setCurrentAlpha(alpha);
        props.on_alpha_change(alpha);
    };

    return (
        <div className="color-tray"
            style={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            <div
                className="color-tray-rows"
                style={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* TODO: more graceful way to do this. perhaps a simple dict that gets generated */}
                <ColorTrayRow>
                    <ColorTrayOption name="black" value="#000000" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="white" value="#ffffff" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="red" value="#ff2020" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="green" value="#10ff40" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="blue" value="#0096ff" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="orange" value="#ffa500" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="dark brown" value="#8b4513" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="lemon yellow" value="#fff44f" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="magenta" value="#f432ff" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="dark green" value="#006400" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="dust" value="#e5aa70" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                </ColorTrayRow>
                <ColorTrayRow>
                    <ColorTrayOption name="dark gray" value="#444444" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="gray" value="#888888" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="salmon" value="#ff8c69" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="chartreuse" value="#7fff33" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="cyan" value="#00ffff" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="ochre" value="#d27d2d" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="coffee brown" value="#a0522d" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="mustard yellow" value="#f4c430" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="violet" value="#cf9fff" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="mint" value="#90ee90" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                    <ColorTrayOption name="cream" value="#f2d2bd" size={color_box_size} color_change_handler={on_color_change} current_color={current_color} />
                </ColorTrayRow>
            </div>

            <div
                className="color-tray-custom-container"
                style={{
                    position: "relative",
                    marginLeft: tool_box_size / 10,
                }}
            >
                <input
                    className="color-tray-custom color-tray-option tray-option"

                    style={{
                        width: tool_box_size,
                        height: tool_box_size,
                    }}

                    type="color"
                    value={current_color}

                    onChange={(e) => on_color_change(e.target.value)}

                    aria-label="select custom color"
                />
                <Image
                    className="color-tray-custom-overlay"
                    style={{
                        position: "absolute",

                        width: tool_box_size / 2,
                        height: tool_box_size / 2,

                        top: tool_box_size / 4,
                        left: tool_box_size / 4,

                        filter: `invert(${picker_invert_value}) drop-shadow(0px 0px 1px #222)`,

                        pointerEvents: "none",
                    }}

                    aria-hidden="true"
                    alt=""

                    src={picker_icon}
                    priority={true}
                />
            </div>

            <label
                className="color-tray-alpha-label-container tray-label-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: tool_box_size / 10,
                }}
            >
                Alpha:

                <input
                    className="color-tray-alpha"

                    style={{
                        width: tool_box_size * 2,
                        height: tool_box_size / 2,
                    }}

                    type="range"

                    min="0"
                    max="1"
                    step="0.01"
                    value={current_alpha}

                    onChange={(e) => on_alpha_change(e.target.valueAsNumber)}
                />
            </label>
        </div>
    );
};

export default ColorTray;

// TODO: i18n
