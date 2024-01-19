import Image from "next/image";

import { useTranslation } from "react-i18next";

import { SketchCommand } from "./SketchCanvas";
import useKeyHandler from "../hooks/useKeyHandler";

import undo_icon from "../assets/icons/undo.svg";
import redo_icon from "../assets/icons/redo.svg";
import clear_icon from "../assets/icons/clear.svg";

const command_icons = {
    "undo": undo_icon.src,
    "redo": redo_icon.src,
    "clear": clear_icon.src
};

export interface CommandTrayOptionProps {
    value: SketchCommand;
    command_run: (command: SketchCommand) => void;
    disabled?: boolean;
    keybind: string;
}

const CommandTrayOption: React.FC<CommandTrayOptionProps> = (props) => {
    const { t } = useTranslation();

    useKeyHandler(() => { if (!props.disabled) props.command_run(props.value); }, props.keybind);

    return (
        <button
            className="tray-option command-tray-option"

            style={{
                width: "var(--tool-box-size)",
                aspectRatio: 1,

                padding: 0,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                position: "relative"
            }}

            onClick={() => props.command_run(props.value)}

            // TODO:ux: should these be fully self contained strings? will order change in some languages if command name is different?
            // TODO:structure: clean up
            aria-label={t(props.disabled ? "aria label.run command disabled" : "aria label.run command", { cmd: t("command." + props.value), key: props.keybind })}
            data-tooltip={t(props.disabled ? "tooltip.click to run command disabled" : "tooltip.click to run command", { cmd: t("command." + props.value) })}


            disabled={props.disabled ?? false}
        >
            <Image
                className="tray-option-icon command-tray-option-icon"

                // TODO:other: these values are made smaller than tools since the command icons are larger. revert once icons are consistent
                // additionally, bin icon made even smaller since the icon is larger than the others

                style={{
                    position: "absolute",

                    bottom: "calc(var(--tool-box-size) / 10)",
                    left: "calc(var(--tool-box-size) / 10)",

                    width: `${(props.value === "clear" ? 45 : 50)}%`,
                    height: `${(props.value === "clear" ? 45 : 50)}%`,  // TODO:ux: i'm not a huge fan of the reduced scale icons, but it makes the keybinds more visible. maybe make the keybinds part of the icon then this can be reverted. or perhaps toggleable?
                }}

                // TODO:ux: calculate good render size (width and height props directly on image). or see if it supports svg properly?
                width={250}
                height={250}

                aria-hidden="true"
                alt=""

                draggable={false}

                src={command_icons[props.value]}
            />
            <kbd
                className="tray-option-keybind command-tray-option-keybind"
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

export default CommandTrayOption;

// TODO:structure: unify with color tray option, perhaps with a generic tray option component and extend it
// TODO:ux: consider moving <kbd> to side panel, if we decide to display scroll wheel keybinds there
// TODO:structure: at least unify similar elements in each option to their own components
