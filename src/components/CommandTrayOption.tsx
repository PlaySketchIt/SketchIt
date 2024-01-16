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
                backgroundImage: `url(${command_icons[props.value]})`,
                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            onClick={() => props.command_run(props.value)}

            aria-label={"run " + props.value + " command"}

            disabled={props.disabled ?? false}
        >
        </button>
    );
};

export default CommandTrayOption;

// TODO: unify with color tray option
// TODO: hotkeys
