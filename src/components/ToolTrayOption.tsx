import pen_icon from "../assets/pen.svg";
import eraser_icon from "../assets/eraser.svg";
import fill_icon from "../assets/fill.svg";
import { SketchTool } from "./SketchCanvas";

const tool_icons = {
    "pen": pen_icon,
    "eraser": eraser_icon,
    "fill": fill_icon
};

export interface ToolTrayOptionProps {
    value: SketchTool;
    size?: number;

    current_tool: SketchTool;

    tool_change: (tool: SketchTool) => void;
}

const ToolTrayOption: React.FC<ToolTrayOptionProps> = (props) => {
    return (
        <button
            className="tool-tray-option"
            style={{
                backgroundImage: `url(${tool_icons[props.value]})`,
                backgroundColor: props.current_tool  === props.value ? "#dddddd" : "#ffffff",

                backgroundSize: "75%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",

                border: "1px solid black",

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            onClick={() => props.tool_change(props.value)}
        >
        </button>
    );
};

export default ToolTrayOption;

// TODO: unify with color tray option
