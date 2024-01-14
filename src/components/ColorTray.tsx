import { useState } from "react";

import ColorTrayOption from "./ColorTrayOption";

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

const ColorTray: React.FC<ColorTrayProps> = (props) => {
    const tool_box_size = props.tool_box_size ?? 40;
    const color_box_size = tool_box_size / 2;

    const [current_color, setCurrentColor] = useState(props.init_color);
    const [current_alpha, setCurrentAlpha] = useState(props.init_alpha ?? 1);

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
                {/* TODO: more graceful way to do this */}
                <ColorTrayRow>
                    {/* black, white, red, green, blue, yellow, cyan, magenta, dark green */}
                    <ColorTrayOption value="#000000" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#ffffff" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#ff0000" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#00ff00" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#0000ff" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#ffff00" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#00ffff" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#ff00ff" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#006400" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                </ColorTrayRow>
                <ColorTrayRow>
                    {/* gray, dark gray, cream, ochre, dark brown, orangy brown, olive, violet, light green */}
                    <ColorTrayOption value="#888888" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#444444" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#F2D2BD" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#D27D2D" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#8b4513" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#a0522d" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#808000" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#ee82ee" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                    <ColorTrayOption value="#90ee90" size={color_box_size} color_change={on_color_change} current_color={current_color} />
                </ColorTrayRow>
            </div>
            <input
                className="color-tray-custom color-tray-option tray-option"

                style={{
                    width: tool_box_size,
                    height: tool_box_size,
                }}

                type="color"
                value={current_color}

                onChange={(e) => on_color_change(e.target.value)}
            >
            </input>

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
