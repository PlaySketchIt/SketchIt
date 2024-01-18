import Image from "next/image";

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
    box_size_vw?: number;

    command_run: (command: SketchCommand) => void;

    disabled?: boolean;

    keybind: string;
}

const CommandTrayOption: React.FC<CommandTrayOptionProps> = (props) => {
    useKeyHandler(() => { if (!props.disabled) props.command_run(props.value); }, props.keybind);

    const box_size_vw = props.box_size_vw ?? 2.5;

    return (
        <button
            className="tray-option command-tray-option"

            style={{
                width: `${box_size_vw}vw`,
                height: `${box_size_vw}vw`,

                padding: 0,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                position: "relative"
            }}

            onClick={() => props.command_run(props.value)}

            aria-label={`run ${props.value} command${props.disabled ? " (disabled)" : ""} [keybind: ${props.keybind}]`}

            disabled={props.disabled ?? false}
        >
            <Image
                className="tray-option-icon command-tray-option-icon"

                // TODO: these values are made smaller than tools since the command icons are larger. revert once icons are consistent
                style={{
                    width: `${box_size_vw * 0.6}vw`,
                    height: `${box_size_vw * 0.6}vw`,
                }}

                // rendered size. not the same as viewport size. //TODO: adjust reasonably, otherwise no point using svg
                width={box_size_vw}
                height={box_size_vw}

                aria-hidden="true"
                alt=""

                draggable={false}

                src={command_icons[props.value]}
            />
            <kbd
                className="tray-option-keybind command-tray-option-keybind"
                style={{
                    position: "absolute",
                    top: 0,
                    right: `${box_size_vw / 20}vw`,

                    fontSize: `${box_size_vw / 3}vw`,
                    verticalAlign: "super"
                }}

                aria-hidden="true"
            >
                {props.keybind}
            </kbd>
        </button>
    );
};

export default CommandTrayOption;

// TODO: unify with color tray option, perhaps with a generic tray option component and extend it
// TODO: consider moving <kbd> to side panel, if we decide to display scroll wheel keybinds there
// TODO: at least unify similar elements in each option to their own components
