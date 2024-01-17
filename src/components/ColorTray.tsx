import { useEffect, useState } from "react";

import ColorTrayOption, { HexColor } from "./ColorTrayOption";
import ColorTrayCustom from "./ColorTrayCustom";
import useKeyHandler from "../hooks/useKeyHandler";


export interface ColorTrayProps {
    init_color: HexColor;
    init_alpha?: number;
    tool_box_size?: number;
    on_color_change: (color: HexColor) => void;
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


const ColorTray: React.FC<ColorTrayProps> = (props) => {
    useKeyHandler(() => { setCurrentAlpha(current_alpha - 0.05); }, "a"); // TODO: step and binds on props
    useKeyHandler(() => { setCurrentAlpha(current_alpha + 0.05); }, "d");

    // effect: check value is in hex format without alpha
    useEffect(() => {
        if (!props.init_color.match(/^#[0-9a-fA-F]{6}$/)) {
            throw new Error("invalid color value (must be #rrggbb): " + props.init_color);
        }
    }, [props.init_color]);

    const tool_box_size = props.tool_box_size ?? 40;
    const color_box_size = tool_box_size / 2;

    const [current_color, setCurrentColor] = useState<HexColor>(props.init_color);
    const [current_alpha, setCurrentAlpha] = useState<number>(props.init_alpha ?? 1);

    // have to destructure for effects. passing props.on_color_change isn't working and passing whole props is inefficient
    const { on_color_change, on_alpha_change } = props;

    // effect: callback when values change
    useEffect(() => {
        on_color_change(current_color);
    }, [current_color, on_color_change]);

    useEffect(() => {
        on_alpha_change(current_alpha);
    }, [current_alpha, on_alpha_change]);

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
                    <ColorTrayOption name="black" value="#000000" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="white" value="#ffffff" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="red" value="#ff2020" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="green" value="#10ff40" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="blue" value="#0096ff" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="orange" value="#ffa500" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="dark brown" value="#8b4513" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="lemon yellow" value="#fff44f" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="magenta" value="#f432ff" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="dark green" value="#006400" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="dust" value="#e5aa70" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                </ColorTrayRow>
                <ColorTrayRow>
                    <ColorTrayOption name="dark gray" value="#444444" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="gray" value="#888888" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="salmon" value="#ff8c69" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="chartreuse" value="#7fff33" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="cyan" value="#00ffff" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="ochre" value="#d27d2d" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="coffee brown" value="#a0522d" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="mustard yellow" value="#f4c430" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="violet" value="#cf9fff" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="mint" value="#90ee90" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                    <ColorTrayOption name="cream" value="#f2d2bd" size={color_box_size} color_change_handler={setCurrentColor} current_color={current_color} />
                </ColorTrayRow>
            </div>

            <ColorTrayCustom current_color={current_color} tool_box_size={tool_box_size} on_color_change={setCurrentColor} />

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

                    onChange={(e) => setCurrentAlpha(e.target.valueAsNumber)}
                />
            </label>
        </div>
    );
};

export default ColorTray;

// TODO: i18n
// TODO: color keybinds? keybind to open picker?
// TODO: ability to save custom colors. could also have alpha presets. could either replace existing tray options or be a separate tray. or perhaps show near picker
