
import Image from "next/image";

import styles from "./ColorTrayCustom.module.css";
import picker_icon from "../../assets/icons/picker.svg";

import { HexColor } from "../ColorTrayOption";

export interface ColorTrayCustomProps {
    current_color: HexColor;
    box_size_vw: number;
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
    // TODO: should color be validated? or do we just trust the parent component?
    const picker_invert_value = calculate_luminance(props.current_color) > 0.5 ? "0%" : "100%"; // TODO: configurable threshold + shadow amount.

    return (
        <div
            className={styles.container + " color-tray-custom-container"}
            style={{
                marginLeft: `${props.box_size_vw / 4}vw`,
                
                width: `${props.box_size_vw}vw`,
                height: `${props.box_size_vw}vw`,
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

                aria-label="select custom color"
            />
            <Image
                className={styles.overlay + " color-tray-custom-overlay"}
                style={{
                    width: "50%",
                    height: "auto",

                    objectFit: "contain",

                    top: `${props.box_size_vw / 4}vw`,
                    left: `${props.box_size_vw / 4}vw`,

                    filter: `invert(${picker_invert_value}) drop-shadow(0px 0px 1px #222)`,
                }}

                // rendered size. not the same as viewport size. //TODO: adjust reasonably, otherwise no point using svg
                width={props.box_size_vw}
                height={props.box_size_vw}

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

// TODO: convert other components to directories and replace inline styles with modules
