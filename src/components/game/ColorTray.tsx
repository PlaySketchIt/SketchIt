import { useTranslation } from "react-i18next";

import ColorTrayOption, { HexColor } from "./ColorTrayOption";
import ColorTrayCustom from "./ColorTrayCustom";
import useKeyHandler from "../../hooks/useKeyHandler";

export interface ColorTrayProps {
    current_color: HexColor;
    current_alpha: number;

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
    const { t } = useTranslation();

    useKeyHandler(() => { props.on_alpha_change(props.current_alpha - 0.05); }, "a"); // TODO:lib: step and binds on props
    useKeyHandler(() => { props.on_alpha_change(props.current_alpha + 0.05); }, "d");

    return (
        <div className="color-tray tray"
            style={{
                display: "flex",
                flexDirection: "row",

                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div
                className="color-tray-rows"
                style={{
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* TODO:lib/structure: more graceful way to do this. perhaps a simple dict that gets generated */}
                <ColorTrayRow>
                    <ColorTrayOption name_key="black" value="#000000" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="white" value="#ffffff" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="red" value="#ff2020" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="light green" value="#10ff40" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="blue" value="#0096ff" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="orange" value="#ffa500" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="dark brown" value="#8b4513" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="lemon yellow" value="#fff44f" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="magenta" value="#f432ff" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="dark green" value="#006400" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="dusty beige" value="#e5aa70" color_change_handler={props.on_color_change} current_color={props.current_color} />
                </ColorTrayRow>
                <ColorTrayRow>
                    <ColorTrayOption name_key="dark gray" value="#444444" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="light gray" value="#888888" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="salmon" value="#ff8c69" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="chartreuse" value="#7fff33" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="cyan" value="#00ffff" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="ochre" value="#d27d2d" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="coffee brown" value="#a0522d" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="mustard yellow" value="#f4c430" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="violet" value="#cf9fff" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="mint green" value="#90ee90" color_change_handler={props.on_color_change} current_color={props.current_color} />
                    <ColorTrayOption name_key="cream" value="#f2d2bd" color_change_handler={props.on_color_change} current_color={props.current_color} />
                </ColorTrayRow>
            </div>

            <ColorTrayCustom current_color={props.current_color} on_color_change={props.on_color_change} />

            <label
                className="color-tray-alpha-label-container tray-label-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    marginLeft: "calc(var(--tool-box-size) / 5)",
                    fontSize: "calc(var(--tool-box-size) / 3)", // TODO:structure: css var --tray-label-font-size is redundant!
                }}
            >
                {t("ui label.alpha slider")}

                <input
                    className="color-tray-alpha"

                    style={{
                        width: "calc(var(--tool-box-size) * 2)",
                        height: "calc(var(--tool-box-size) / 2)",
                    }}

                    type="range"

                    min="0"
                    max="1"
                    step="0.01"
                    value={props.current_alpha}

                    onChange={(e) => props.on_alpha_change(e.target.valueAsNumber)}
                />
            </label>
        </div>
    );
};

export default ColorTray;

// TODO:ux: i18n
// TODO:feat: color keybinds? keybind to open picker?
// TODO:feat: ability to save custom colors. could also have alpha presets. could either replace existing tray options or be a separate tray. or perhaps show near picker
