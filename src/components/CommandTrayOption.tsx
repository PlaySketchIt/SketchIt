import Image from "next/image";

import { SketchCommand } from "./SketchCanvas";

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
}

const CommandTrayOption: React.FC<CommandTrayOptionProps> = (props) => {
    return (
        <button
            className="tray-option command-tray-option"

            style={{
                width: props.size ?? 20,
                height: props.size ?? 20,

                padding: 0,

                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}

            onClick={() => props.command_run(props.value)}

            aria-label={"run " + props.value + " command"}

            disabled={props.disabled ?? false}
        >
            <Image
                className="tray-option-icon command-tray-option-icon"

                width={(props.size ?? 20) * 0.75}
                height={(props.size ?? 20) * 0.75}

                aria-hidden="true"
                alt=""

                src={command_icons[props.value]}
            />
        </button>
    );
};

export default CommandTrayOption;

// TODO: unify with color tray option
// TODO: hotkeys
