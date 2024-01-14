import { useState } from "react";

import { SketchTool } from "./SketchCanvas";
import ToolTrayOption from "./ToolTrayOption";

export interface ToolTrayProps {
    init_tool: SketchTool;
    tool_box_size?: number;
    on_tool_change: (tool: SketchTool) => void;
}

const ToolTray: React.FC<ToolTrayProps> = (props) => {
    const tool_box_size = props.tool_box_size ?? 40;

    const [current_tool, setCurrentTool] = useState(props.init_tool);

    const on_tool_change = (tool: SketchTool) => {
        setCurrentTool(tool);
        props.on_tool_change(tool);
    };

    return (
        <div className="tool-tray"
            style={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            <ToolTrayOption value="pen" size={tool_box_size} tool_change={on_tool_change} current_tool={current_tool} />
            <ToolTrayOption value="fill" size={tool_box_size} tool_change={on_tool_change} current_tool={current_tool} />
        </div>
    );
};

export default ToolTray;
