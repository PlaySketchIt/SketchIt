import undo_icon from "../assets/undo.svg";
import redo_icon from "../assets/redo.svg";
import clear_icon from "../assets/clear.svg";

import { SketchCommand } from "./SketchCanvas";

const command_icons = {
    "undo": undo_icon,
    "redo": redo_icon,
    "clear": clear_icon
};

export interface CommandTrayOptions {
    value: SketchCommand;
    size?: number;

    command_run: (command: SketchCommand) => void;
}

const CommandTrayOption: React.FC<CommandTrayOptions> = (props) => {
    return (
        <button
            className="command-tray-option"
            style={{
                backgroundImage: `url(${command_icons[props.value]})`,

                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",

                border: "1px solid black",

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            // TODO: hover effect

            onClick={() => props.command_run(props.value)}
        >
        </button>
    );
};

export default CommandTrayOption;

// TODO: unify with color tray option
// TODO: hotkeys
