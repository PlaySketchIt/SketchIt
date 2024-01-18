import { SketchCommand } from "./SketchCanvas";
import CommandTrayOption from "./CommandTrayOption";

export interface CommandTrayProps {
    tool_box_size_vw?: number;

    on_command_run: (command: SketchCommand) => void;

    can_undo: boolean;
    can_redo: boolean;
}

const CommandTray: React.FC<CommandTrayProps> = (props) => {
    const tool_box_size_vw = props.tool_box_size_vw ?? 2.5;

    return (
        <div className="command-tray tray"
            style={{
                display: "flex",
                flexDirection: "row",

                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <CommandTrayOption value="undo" keybind="z" box_size_vw={tool_box_size_vw} command_run={props.on_command_run} disabled={!props.can_undo} />
            <CommandTrayOption value="redo" keybind="x" box_size_vw={tool_box_size_vw} command_run={props.on_command_run} disabled={!props.can_redo} />
            <CommandTrayOption value="clear" keybind="c" box_size_vw={tool_box_size_vw} command_run={props.on_command_run} />
        </div>
    );
};

export default CommandTray;

// TODO: unite labelled slider input into a single component
// TODO: unite trays into a single component
// TODO: configurable keybinds. support key combos?
