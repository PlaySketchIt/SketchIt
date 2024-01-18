import { useEffect } from "react";

export type HexColor = `#${string}`;
// TODO: put in common file

export interface ColorTrayOptionProps {
    name: string;
    value: HexColor;

    current_color: HexColor;

    color_change_handler: (color: HexColor) => void;
}

const calculate_luminance = (color: HexColor) => {
    // https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
    const r = parseInt(color.substring(1, 3), 16) / 255;
    const g = parseInt(color.substring(3, 5), 16) / 255;
    const b = parseInt(color.substring(5, 7), 16) / 255;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// TODO: unite with method in ColorTrayCustom.tsx, cant export from either so must be in a separate file

const ColorTrayOption: React.FC<ColorTrayOptionProps> = (props) => {
    // effect: check value is in hex format without alpha
    useEffect(() => {
        if (!props.value.match(/^#[0-9a-fA-F]{6}$/)) {
            throw new Error("invalid color value (must be #rrggbb): " + props.value);
        }
    }, [props.value]);

    const is_light_color = calculate_luminance(props.value) > 0.5;
    // TODO: sync with threshold in ColorTray.tsx

    let classes = "color-tray-option tray-option";

    if (is_light_color) {
        classes += " light-color";
    }

    if (props.value === props.current_color) {
        classes += " color-tray-option-selected tray-option-selected";
    }

    // TODO: should class stuff be in effect?

    return (
        <button
            className={classes}

            aria-label={"select " + props.name + " color"}

            data-color-name={props.name}
            data-color-value={props.value}

            style={{
                backgroundColor: props.value,

                width: "calc(var(--tool-box-size) / 2)",
                aspectRatio: 1,
            }}

            onClick={() => props.color_change_handler(props.value)}
        >
        </button>
    );
};

export default ColorTrayOption;

// TODO: tooltip using names
