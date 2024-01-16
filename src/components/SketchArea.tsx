import { useState, useRef, useEffect } from "react";

import SketchCanvas, { SketchCanvasRef, SketchCanvasProps, SketchTool } from "./SketchCanvas";
import ColorTray from "./ColorTray";
import ToolTray from "./ToolTray";
import CommandTray from "./CommandTray";

export interface SketchAreaProps extends Omit<SketchCanvasProps, "alpha" | "fg_color" | "current_tool"> {
    scroll_step?: number;
    tolerance_step?: number; // TODO: decide whether scroll should affect tolerance if fill selected. change props to reflect that
    tool_box_size?: number;
}

const SketchArea: React.FC<SketchAreaProps> = (props) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const [pen_radius, setPenRadius] = useState(props.pen_radius);
    const [fg_color, setFgColor] = useState("#000000");
    const [alpha, setAlpha] = useState(1);

    const [fill_tolerance, setFillTolerance] = useState(props.fill_tolerance);

    const [current_tool, setCurrentTool] = useState<SketchTool>("pen");

    const sketch_canvas_ref = useRef<SketchCanvasRef>(null);
    
    const [can_undo, setCanUndo] = useState(false);
    const [can_redo, setCanRedo] = useState(false);

    const scroll_step = props.scroll_step ?? 1;

    const on_scroll_wheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (current_tool === "fill") return;

        e.stopPropagation();

        const delta = -e.deltaY;
        const new_radius = pen_radius + delta / 100 * scroll_step;

        if (new_radius < min_radius || new_radius > max_radius) return;

        setPenRadius(new_radius);
    };

    // effect: register undo and redo enable check handlers
    useEffect(() => {
        if (sketch_canvas_ref.current === null) return;

        sketch_canvas_ref.current.set_on_redo_enabled_change((enabled) => {
            setCanRedo(enabled);
        });

        sketch_canvas_ref.current.set_on_undo_enabled_change((enabled) => {
            setCanUndo(enabled);
        });
    }, [sketch_canvas_ref]);


    return (
        <div className="sketch-area" onWheel={on_scroll_wheel}>
            <SketchCanvas
                ref={sketch_canvas_ref}
                background={props.background}

                fg_color={fg_color}
                alpha={alpha}

                current_tool={current_tool}

                width={props.width}
                height={props.height}

                min_radius={min_radius}
                max_radius={max_radius}
                pen_radius={pen_radius}

                fill_tolerance={fill_tolerance}

                pressure_modifier={props.pressure_modifier}
            />
            <div
                className="sketch-trays"
                style={{
                    display: "flex",
                    flexDirection: "row",

                    gap: (props.tool_box_size ?? 40) * 1.5,
                }}
            >
                <ColorTray
                    tool_box_size={props.tool_box_size}
                    init_color={fg_color}
                    init_alpha={alpha}
                    on_color_change={setFgColor}
                    on_alpha_change={setAlpha}
                />
                <ToolTray
                    init_tool={current_tool}
                    tool_box_size={props.tool_box_size}

                    min_radius={min_radius}
                    max_radius={max_radius}
                    pen_radius={pen_radius}
                    radius_step={props.scroll_step ?? 1}

                    fill_tolerance={fill_tolerance}
                    tolerance_step={props.tolerance_step ?? 1}

                    on_tool_change={setCurrentTool}
                    on_radius_change={setPenRadius}
                    on_tolerance_change={setFillTolerance}
                />
                <CommandTray
                    tool_box_size={props.tool_box_size}
                    on_command_run={(cmd) => {
                        if (sketch_canvas_ref.current === null) return;
                        sketch_canvas_ref.current.handle_command(cmd);
                    }}

                    can_undo={can_undo}
                    can_redo={can_redo}
                />
            </div>
        </div>
    );
};

export default SketchArea;

// TODO: use viewport units
