import { SketchCommand } from "./SketchCanvas";
import CommandTrayOption from "./CommandTrayOption";

export interface CommandTrayProps {
    on_command_run: (command: SketchCommand) => void;

    can_undo: boolean;
    can_redo: boolean;
}

const CommandTray: React.FC<CommandTrayProps> = (props) => {
    return (
        <div className="command-tray tray"
            style={{
                display: "flex",
                flexDirection: "row",

                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <CommandTrayOption value="undo" keybind="z" command_run={props.on_command_run} disabled={!props.can_undo} />
            <CommandTrayOption value="redo" keybind="x" command_run={props.on_command_run} disabled={!props.can_redo} />
            <CommandTrayOption value="clear" keybind="c" command_run={props.on_command_run} />
        </div>
    );
};

export default CommandTray;

// TODO:structure: unite labelled slider input into a single component
// TODO:structure: unite trays into a single component
// TODO:feat: configurable keybinds. support key combos?
