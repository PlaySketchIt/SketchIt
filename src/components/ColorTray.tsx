import { useState } from "react";

import ColorTrayOption from "./ColorTrayOption";

export interface ColorTrayProps {
    init_color: string;
    box_size?: number;
    on_color_change: (color: string) => void;
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
    const [current_color, setCurrentColor] = useState(props.init_color);

    const on_color_change = (color: string) => {
        setCurrentColor(color);
        props.on_color_change(color);
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
                    <ColorTrayOption value="#000000" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#ffffff" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#ff0000" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#00ff00" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#0000ff" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#ffff00" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#00ffff" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#ff00ff" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#006400" size={props.box_size} color_change={on_color_change} />
                </ColorTrayRow>
                <ColorTrayRow>
                    {/* gray, dark gray, cream, ochre, dark brown, orangy brown, olive, violet, light green */}
                    <ColorTrayOption value="#888888" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#444444" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#F2D2BD" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#D27D2D" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#8b4513" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#a0522d" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#808000" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#ee82ee" size={props.box_size} color_change={on_color_change} />
                    <ColorTrayOption value="#90ee90" size={props.box_size} color_change={on_color_change} />
                </ColorTrayRow>
            </div>
            <input
                className="color-tray-custom"

                style={{
                    width: (props.box_size ?? 20) * 2,
                    height: (props.box_size ?? 20) * 2,
                    
                    border: "2px solid black",
                }}

                type="color"
                value={current_color}

                onChange={(e) => on_color_change(e.target.value)}
            >
            </input>
        </div>
    );
};

export default ColorTray;
