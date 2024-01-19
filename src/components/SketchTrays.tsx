import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

import { SketchCanvasProps, SketchCanvasRef, SketchTool } from "./SketchCanvas";

import ColorTray from "./ColorTray";
import ToolTray from "./ToolTray";
import CommandTray from "./CommandTray";

import { HexColor } from "./ColorTrayOption";

export interface SketchTraysProps extends Omit<SketchCanvasProps, "alpha" | "fg_color" | "current_tool" | "fill_tolerance" | "brush_radius"> {
    sketch_canvas_ref_curr: SketchCanvasRef | null;

    init_color: HexColor;
    init_alpha: number;
    init_radius: number;
    init_tolerance: number;
    init_tool: SketchTool;

    scroll_step?: number;
    tolerance_step?: number; // TODO:ux: decide whether scroll should affect tolerance if fill selected. change props to reflect that
}

export interface SketchTraysRef {
    scroll_handler: (e: React.WheelEvent) => void;
}

const SketchTrays = forwardRef<SketchTraysRef, SketchTraysProps>((props, ref) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const [brush_radius, setBrushRadius] = useState<number>(props.init_radius);
    const [fg_color, setFgColor] = useState<HexColor>(props.init_color);
    const [alpha, setAlpha] = useState<number>(props.init_alpha);

    const [fill_tolerance, setFillTolerance] = useState<number>(props.init_tolerance);

    const [current_tool, setCurrentTool] = useState<SketchTool>(props.init_tool);

    const [can_undo, setCanUndo] = useState<boolean>(false);
    const [can_redo, setCanRedo] = useState<boolean>(false);

    const scroll_step = props.scroll_step ?? 1;

    const scroll_handler = (e: React.WheelEvent) => {
        if (current_tool === "fill") return;

        e.stopPropagation();

        const delta = -e.deltaY;
        const new_radius = brush_radius + delta / 100 * scroll_step;

        if (new_radius < min_radius || new_radius > max_radius) return;

        setBrushRadius(new_radius);
    };

    // effect: register undo and redo enable check handlers
    useEffect(() => {
        if (props.sketch_canvas_ref_curr === null) return;

        props.sketch_canvas_ref_curr.set_on_redo_enabled_change((enabled) => {
            setCanRedo(enabled);
        });

        props.sketch_canvas_ref_curr.set_on_undo_enabled_change((enabled) => {
            setCanUndo(enabled);
        });
    }, [props.sketch_canvas_ref_curr]);


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


    // expose ref methods
    useImperativeHandle(ref, () => ({
        scroll_handler,
    }));


    return (
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
                on_command_run={
                    (cmd) => {
                        if (props.sketch_canvas_ref_curr === null) return;
                        props.sketch_canvas_ref_curr.handle_command(cmd);
                    }
                }

                can_undo={can_undo}
                can_redo={can_redo}
            />
        </div>
    );
});

export default SketchTrays;
