import { useState, useRef, useEffect } from "react";

import SketchCanvas, { SketchCanvasRef, SketchCanvasProps, SketchTool } from "./SketchCanvas";
import ColorTray from "./ColorTray";
import ToolTray from "./ToolTray";
import CommandTray from "./CommandTray";

import type { HexColor } from "./ColorTrayOption";

export interface SketchAreaProps extends Omit<SketchCanvasProps, "alpha" | "fg_color" | "current_tool"> {
    scroll_step?: number;
    tolerance_step?: number; // TODO:ux: decide whether scroll should affect tolerance if fill selected. change props to reflect that
}

const SketchArea: React.FC<SketchAreaProps> = (props) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const [brush_radius, setBrushRadius] = useState<number>(props.brush_radius);
    const [fg_color, setFgColor] = useState<HexColor>("#000000"); // TODO:lib: possibly have configurable default color
    const [alpha, setAlpha] = useState<number>(1);

    const [fill_tolerance, setFillTolerance] = useState<number>(props.fill_tolerance);

    const [current_tool, setCurrentTool] = useState<SketchTool>("brush");

    const sketch_canvas_ref = useRef<SketchCanvasRef>(null);

    const [can_undo, setCanUndo] = useState<boolean>(false);
    const [can_redo, setCanRedo] = useState<boolean>(false);

    const scroll_step = props.scroll_step ?? 1;

    const on_scroll_wheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (current_tool === "fill") return;

        e.stopPropagation();

        const delta = -e.deltaY;
        const new_radius = brush_radius + delta / 100 * scroll_step;

        if (new_radius < min_radius || new_radius > max_radius) return;

        setBrushRadius(new_radius);
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


    // needed to avoid race condition where local storage is loaded after state is set
    const [radius_loaded, setRadiusLoaded] = useState<boolean>(false);
    const [tolerance_loaded, setToleranceLoaded] = useState<boolean>(false);

    // effect: load brush radius from local storage if exists
    useEffect(() => {
        if (radius_loaded) return;

        const radius = localStorage.getItem("brush_radius");
        if (radius === null) {
            setRadiusLoaded(true);
            return;
        }

        setBrushRadius(Number(radius));
        setRadiusLoaded(true);
    }, [radius_loaded]);

    // effect: load fill tolerance from local storage if exists
    useEffect(() => {
        if (tolerance_loaded) return;

        const tolerance = localStorage.getItem("fill_tolerance");
        if (tolerance === null) {
            setToleranceLoaded(true);
            return;
        }

        setFillTolerance(Number(tolerance));
        setToleranceLoaded(true);
    }, [tolerance_loaded]);

    // effect: save brush radius to local storage on change
    // TODO:perf: would be more efficient if it only ran on unmount, but don't know how to do that (since we must pass brush_radius) could just call the method when the parent decides to unmount
    useEffect(() => {
        if (!radius_loaded) return;

        localStorage.setItem("brush_radius", brush_radius.toString());
    }, [brush_radius, radius_loaded]);

    // effect: save fill tolerance to local storage on change
    // TODO:perf: would be more efficient if it only ran on unmount, but don't know how to do that (since we must pass fill_tolerance). could just call the method when the parent decides to unmount
    useEffect(() => {
        if (!tolerance_loaded) return;

        localStorage.setItem("fill_tolerance", fill_tolerance.toString());
    }, [fill_tolerance, tolerance_loaded]);


    return (
        <div
            className="sketch-area"
            style={{
                display: "flex",
            }}
            onWheel={on_scroll_wheel}>
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
                brush_radius={brush_radius}

                fill_tolerance={fill_tolerance}

                pressure_modifier={props.pressure_modifier}

                undo_steps={props.undo_steps}
            />
            <div
                className="sketch-trays"
                style={{
                    display: "flex",
                }}
            >
                <ColorTray
                    current_color={fg_color}
                    current_alpha={alpha}
                    on_color_change={setFgColor}
                    on_alpha_change={setAlpha}
                />
                <ToolTray
                    init_tool={current_tool}

                    min_radius={min_radius}
                    max_radius={max_radius}
                    brush_radius={brush_radius}
                    radius_step={props.scroll_step ?? 1}

                    fill_tolerance={fill_tolerance}
                    tolerance_step={props.tolerance_step ?? 1}

                    on_tool_change={setCurrentTool}
                    on_radius_change={setBrushRadius}
                    on_tolerance_change={setFillTolerance}
                />
                <CommandTray
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
