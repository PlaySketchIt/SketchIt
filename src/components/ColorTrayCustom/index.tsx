
import Image from "next/image";

import { useTranslation } from "react-i18next";

import styles from "./ColorTrayCustom.module.css";
import picker_icon from "../../assets/icons/picker.svg";

import { HexColor } from "../ColorTrayOption";

export interface ColorTrayCustomProps {
    current_color: HexColor;
    on_color_change: (color: HexColor) => void;
}


const calculate_luminance = (color: HexColor) => {
    // https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
    const r = parseInt(color.substring(1, 3), 16) / 255;
    const g = parseInt(color.substring(3, 5), 16) / 255;
    const b = parseInt(color.substring(5, 7), 16) / 255;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ColorTrayCustom: React.FC<ColorTrayCustomProps> = (props) => {
    const { t } = useTranslation();

    // TODO:safety: should color be validated? or do we just trust the parent component?
    const picker_invert_value = calculate_luminance(props.current_color) > 0.5 ? "0%" : "100%"; // TODO:lib: configurable threshold + shadow amount.

    return (
        <div
            className={styles.container + " color-tray-custom-container"}
            style={{
                marginLeft: "calc(var(--tool-box-size) / 4)",
                
                width: "var(--tool-box-size)",
                height: "var(--tool-box-size)",
            }}
        >
            <input
                className={styles.input + " color-tray-custom-input color-tray-option tray-option"}

                style={{
                    width: "100%",
                    height: "100%",
                }}

                type="color"
                value={props.current_color}

                // assumption made
                onChange={(e) => props.on_color_change(e.target.value as HexColor)}

                aria-label={t("aria label.select custom color using picker")}
                data-tooltip={t("tooltip.click to select custom color")}
            />
            <Image
                className={styles.overlay + " color-tray-custom-overlay"}
                style={{
                    width: "50%",
                    height: "auto",

                    objectFit: "contain",

                    top: "calc(var(--tool-box-size) / 4)",
                    left: "calc(var(--tool-box-size) / 4)",

                    filter: `invert(${picker_invert_value}) drop-shadow(0px 0px 1px #222)`,
                }}

                // TODO:ux: calculate good render size (width and height props directly on image). or see if it supports svg properly?
                width={250}
                height={250}

                aria-hidden="true"
                alt=""

                draggable={false}

                src={picker_icon}
                priority={true}
            />
        </div>
    );
};

export default ColorTrayCustom;

// TODO:structure: convert other components to directories and replace inline styles with modules
// TODO:perf: very laggy when dragging color picker!
