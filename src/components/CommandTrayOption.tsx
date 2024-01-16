import { SketchCommand } from "./SketchCanvas";

const command_icons = {
    "undo": "/icons/undo.svg",
    "redo": "/icons/redo.svg",
    "clear": "/icons/clear.svg",
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
