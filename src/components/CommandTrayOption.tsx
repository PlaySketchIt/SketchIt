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
    size?: number;

    command_run: (command: SketchCommand) => void;

    disabled?: boolean;

    keybind: string;
}

const CommandTrayOption: React.FC<CommandTrayOptionProps> = (props) => {
    useKeyHandler(() => { if (!props.disabled) props.command_run(props.value); }, props.keybind);

    return (
        <button
            className="tray-option command-tray-option"

            style={{
                width: props.size ?? 20,
                height: props.size ?? 20,

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

                width={(props.size ?? 20) * 0.6}
                height={(props.size ?? 20) * 0.6} // TODO: these values are made smaller than tools since the command icons are larger. revert once icons are consistent

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
                    right: 1 // TODO: better keyboard style
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
