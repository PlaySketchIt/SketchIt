import { SketchCommand } from "./SketchCanvas";
import CommandTrayOption from "./CommandTrayOption";

export interface CommandTrayProps {
    tool_box_size?: number;

    on_command_run: (command: SketchCommand) => void;

    can_undo: boolean;
    can_redo: boolean;
}

const CommandTray: React.FC<CommandTrayProps> = (props) => {
    const tool_box_size = props.tool_box_size ?? 40;

    return (
        <div className="command-tray"
            style={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            <CommandTrayOption value="undo" size={tool_box_size} command_run={props.on_command_run} disabled={!props.can_undo} />
            <CommandTrayOption value="redo" size={tool_box_size} command_run={props.on_command_run} disabled={!props.can_redo} />
            <CommandTrayOption value="clear" size={tool_box_size} command_run={props.on_command_run} />
        </div>
    );
};

export default CommandTray;

// TODO: unite labelled slider input into a single component
// TODO: unite trays into a single component
