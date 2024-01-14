import undo_icon from "../assets/undo.svg";
import redo_icon from "../assets/redo.svg";
import clear_icon from "../assets/clear.svg";

import { SketchCommand } from "./SketchCanvas";

const command_icons = {
    "undo": undo_icon,
    "redo": redo_icon,
    "clear": clear_icon
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

            disabled={props.disabled ?? false}
        >
        </button>
    );
};

export default CommandTrayOption;

// TODO: unify with color tray option
// TODO: hotkeys
