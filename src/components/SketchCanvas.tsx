import { forwardRef, useRef, useEffect, useState, useCallback, useImperativeHandle } from "react";
import DynamicCursor from "../DynamicCursor";

import type { HexColor } from "./ColorTrayOption";

import FloodFill from "q-floodfill";

// TODO: move definitions into separate file

// using fake enum rather than real enum as exporting enum invalidates fast refresh
export type SketchTool = "pen" | "fill";
export type SketchCommand = "undo" | "redo" | "clear";

export interface SketchCanvasProps {
    width?: number;
    height?: number;

    min_radius?: number;
    max_radius?: number;
    pen_radius: number;

    fill_tolerance: number;

    background: string;

    alpha: number;
    fg_color: HexColor;

    current_tool: SketchTool;

    pressure_modifier: number; // multiplied by pressure (0-1) then added to pen radius, e.g. a modifier of 2 adds 2 radius to the pen at full pressure. no longer clamped to maximum radius.
}

export interface SketchCanvasRef {
    handle_command: (command: SketchCommand) => void;
    set_on_undo_enabled_change: (callback: (can_undo: boolean) => void) => void;
    set_on_redo_enabled_change: (callback: (can_redo: boolean) => void) => void;
}

const SketchCanvas = forwardRef<SketchCanvasRef, SketchCanvasProps>((props, ref) => {
    // effect: check color is in correct hex format
    useEffect(() => {
        if (!props.fg_color.match(/^#[0-9a-fA-F]{6}$/)) {
            throw new Error("invalid foreground color (must be #rrggbb): " + props.fg_color);
        }
    }, [props.fg_color]);

    // TODO: could check pen radius is within min/max radius. could be expensive though and not really necessary
    //const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const render_canvas_ref = useRef<HTMLCanvasElement>(null);
    const draw_canvas_ref = useRef<HTMLCanvasElement>(null);
    const cursor = useRef(new DynamicCursor({
        max_radius: max_radius,
        init_radius: props.pen_radius, // TODO: option to resize based on calculated pressure
        stroke: "#00000080",
        stroke_width: 1.5 // TODO: option to make size consistent with radius (also consider viewport)
        // TODO: adjust transparency based on alpha
    }));

    const [initialised, setInitialised] = useState<boolean>(false);
    const [pen_down, setPenDown] = useState<boolean>(false);

    const load_css_cursor = useCallback(() => {
        if (props.current_tool === "fill") {
            // TODO: custom fill cursor
            if (draw_canvas_ref.current) {
                draw_canvas_ref.current.style.cursor = "crosshair";
            }

            return;
        }

        // TODO: as additional tools added, migrate to switch statement

        cursor.current.set_fill(props.fg_color ?? "black");
        cursor.current.set_radius(props.pen_radius);

        if (draw_canvas_ref.current) {
            draw_canvas_ref.current.style.cursor = cursor.current.as_css_cursor("crosshair");
        }
    }, [props.fg_color, props.pen_radius, props.current_tool]);

    const undo_canvas_state = useRef<ImageData | null>(null);
    const redo_canvas_state = useRef<ImageData | null>(null);

    const on_undo_enabled_change = useRef<(can_undo: boolean) => void>(() => { });
    const on_redo_enabled_change = useRef<(can_redo: boolean) => void>(() => { });

    const capture_undo_canvas_state = () => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (render_canvas && render_ctx) {
            undo_canvas_state.current = render_ctx.getImageData(0, 0, render_canvas.width, render_canvas.height);
            on_undo_enabled_change.current(true);
        }
    };

    const restore_undo_canvas_state = () => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (render_canvas && render_ctx) {
            if (undo_canvas_state.current) {
                render_ctx.putImageData(undo_canvas_state.current, 0, 0);
            }
        }
    };

    const capture_redo_canvas_state = () => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (render_canvas && render_ctx) {
            redo_canvas_state.current = render_ctx.getImageData(0, 0, render_canvas.width, render_canvas.height);
            on_redo_enabled_change.current(true);
        }
    };

    const restore_redo_canvas_state = () => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (render_canvas && render_ctx) {
            if (redo_canvas_state.current) {
                render_ctx.putImageData(redo_canvas_state.current, 0, 0);
            }
        }
    };

    // TODO: unite methods for capturing and restoring canvas state

    const do_floodfill = (x: number, y: number) => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (!render_canvas || !render_ctx) return;

        x = Math.floor(x);
        y = Math.floor(y);

        // add convert color to rgba
        // TODO: better way of parsing color
        const fill_color = `rgba(${parseInt(props.fg_color.substr(1, 2), 16)}, ${parseInt(props.fg_color.substr(3, 2), 16)}, ${parseInt(props.fg_color.substr(5, 2), 16)}, ${props.alpha})`;

        const old_img_data = render_ctx.getImageData(0, 0, render_canvas.width, render_canvas.height);

        // clone image data to avoid modifying original
        const img_data = new ImageData(
            new Uint8ClampedArray(old_img_data.data),
            old_img_data.width,
            old_img_data.height
        );

        const floodfill = new FloodFill(img_data);
        floodfill.fill(fill_color, x, y, props.fill_tolerance);

        // blend partially transparent fill with old image data
        const data = floodfill.imageData.data;

        for (let i = 3; i < data.length; i += 4) {
            const alpha = data[i] / 255;

            data[i - 3] = data[i - 3] * alpha + old_img_data.data[i - 3] * (1 - alpha);
            data[i - 2] = data[i - 2] * alpha + old_img_data.data[i - 2] * (1 - alpha);
            data[i - 1] = data[i - 1] * alpha + old_img_data.data[i - 1] * (1 - alpha);

            // strip alpha channel
            data[i] = 255;
        }

        render_ctx.putImageData(floodfill.imageData, 0, 0);
    };


    const previous_point = useRef<{ x: number, y: number } | null>(null);

    const on_pointer_move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        const draw_canvas = draw_canvas_ref.current;
        const draw_ctx = draw_canvas?.getContext("2d", { willReadFrequently: true });

        if (draw_canvas && draw_ctx) {
            const rect = draw_canvas.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let effective_radius = props.pen_radius;

            if (props.pressure_modifier !== 0 && e.pointerType === "pen") {
                let adjusted_pressure = e.pressure;

                if (e.pressure < 1) {
                    // some tablets tend to be a bit weak at the high zones, so add a little boost
                    adjusted_pressure = e.pressure += 0.1;
                }

                effective_radius = props.pen_radius + (props.pressure_modifier * adjusted_pressure);
            }

            const draw = () => {
                draw_ctx.beginPath();

                if (previous_point.current) {
                    draw_ctx.moveTo(previous_point.current.x, previous_point.current.y);
                    draw_ctx.lineTo(x, y);

                    draw_ctx.lineWidth = effective_radius * 2;
                    draw_ctx.stroke();
                } else {
                    // this is just a dot with no movement
                    draw_ctx.arc(x, y, effective_radius, 0, 2 * Math.PI);
                    draw_ctx.fill();
                }

                previous_point.current = { x: x, y: y };
            };

            //requestAnimationFrame(draw);
            draw();
        }
    };

    const on_pointer_down = (e: React.PointerEvent<HTMLCanvasElement>) => {
        capture_undo_canvas_state();

        redo_canvas_state.current = null;
        on_redo_enabled_change.current(false);

        if (props.current_tool === "fill") {
            const canvas = draw_canvas_ref.current;

            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            do_floodfill(x, y);
            return;
        }

        // TODO: as additional tools added, migrate to switch statement

        previous_point.current = null;

        setPenDown(true);

        // simulate movement to draw first dot
        on_pointer_move(e);
    };

    const on_pointer_up = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        setPenDown(false);

        // simulate movement to draw last dot
        on_pointer_move(e);

        // overlay draw canvas as required then clear it
        push_draw_canvas_to_render();
        clear_draw_canvas();
    };


    const push_draw_canvas_to_render = () => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        const draw_canvas = draw_canvas_ref.current;

        if (!render_canvas || !render_ctx || !draw_canvas) return;
        // TODO: don't silently fail

        //render_ctx.globalAlpha = props.alpha; // this is now set by an effect automatically
        render_ctx.drawImage(draw_canvas, 0, 0);

        // TODO: should this method just call the clear method, or do we trust the caller to do it?
    };


    const clear_render_canvas = useCallback(() => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (!render_canvas || !render_ctx) return;

        render_ctx.fillStyle = props.background;
        render_ctx.fillRect(0, 0, render_canvas.width, render_canvas.height);
    }, [props.background]);

    const clear_draw_canvas = useCallback(() => {
        const draw_canvas = draw_canvas_ref.current;
        const draw_ctx = draw_canvas?.getContext("2d", { willReadFrequently: true });

        if (!draw_canvas || !draw_ctx) return;

        draw_ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height);
    }, []);


    // effect: run at mount time to initialise canvas and cursor
    useEffect(() => {
        if (initialised) return;

        const draw_canvas = draw_canvas_ref.current;
        if (!draw_canvas) return;

        const draw_ctx = draw_canvas.getContext("2d", { willReadFrequently: true });

        if (draw_ctx) {
            // initialise canvases
            clear_draw_canvas();
            clear_render_canvas();

            draw_ctx.lineCap = "round";
            draw_ctx.lineJoin = "round";

            draw_ctx.strokeStyle = props.fg_color;
            draw_ctx.fillStyle = props.fg_color;

            load_css_cursor();
        }

        setInitialised(true);

    }, [initialised, load_css_cursor, clear_draw_canvas, clear_render_canvas, props.fg_color]);


    // effect: run when color/radius/tool changes to update cursor
    useEffect(() => {
        load_css_cursor();
    }, [load_css_cursor]);


    // effect: run when color changes to update canvas color
    useEffect(() => {
        // update canvas color if value changes
        const draw_canvas = draw_canvas_ref.current;
        if (!draw_canvas) return;

        const draw_ctx = draw_canvas.getContext("2d", { willReadFrequently: true });
        if (!draw_ctx) return;

        draw_ctx.fillStyle = props.fg_color;
        draw_ctx.strokeStyle = props.fg_color;
    }, [props.fg_color]);


    // effect: change render globalAlpha as well as draw canvas css transparency when alpha changes
    useEffect(() => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        const draw_canvas = draw_canvas_ref.current;

        if (!render_canvas || !render_ctx || !draw_canvas) return;

        render_ctx.globalAlpha = props.alpha;
        draw_canvas.style.opacity = props.alpha.toString();
    }, [props.alpha]);

    // expose methods to parent upon ref
    useImperativeHandle(ref, () => ({
        handle_command: (command: SketchCommand) => {
            switch (command) {
                case "undo":
                    if (!undo_canvas_state.current) return;

                    capture_redo_canvas_state();
                    restore_undo_canvas_state();

                    undo_canvas_state.current = null;
                    on_undo_enabled_change.current(false);
                    break;
                case "redo":
                    if (!redo_canvas_state.current) return;

                    capture_undo_canvas_state();
                    restore_redo_canvas_state();

                    redo_canvas_state.current = null;
                    on_redo_enabled_change.current(false);
                    break;
                case "clear":
                    capture_undo_canvas_state();
                    clear_render_canvas();

                    redo_canvas_state.current = null;
                    on_redo_enabled_change.current(false);
                    break;
            }
        },
        set_on_undo_enabled_change: (callback: (can_undo: boolean) => void) => {
            on_undo_enabled_change.current = callback;
        },
        set_on_redo_enabled_change: (callback: (can_redo: boolean) => void) => {
            on_redo_enabled_change.current = callback;
        }
        // TODO: this cannot be the best way to do this. passing boolean directly doesn't update the parent though
    }), [clear_render_canvas]);

    return (
        <div
            className="sketch-canvas"

            style={{
                position: "relative",

                width: props.width,
                height: props.height
            }}
        >
            <canvas
                className="sketch-render-layer"
                ref={render_canvas_ref}

                width={props.width}
                height={props.height}

                aria-hidden="true"

                style={{
                    position: "absolute",
                    top: 0,
                    left: 0
                }}
            />
            <canvas
                className="sketch-draw-layer"
                ref={draw_canvas_ref}

                width={props.width}
                height={props.height}

                onPointerDown={on_pointer_down}
                onPointerMove={on_pointer_move}
                onPointerUp={on_pointer_up}

                onPointerEnter={
                    (e: React.PointerEvent<HTMLCanvasElement>) => {
                        // if mouse is down when re-entering canvas, resume drawing
                        // could also just have handlers globally on the window, but this is cleaner
                        if (e.buttons > 0) {
                            setPenDown(true);
                        }
                    }
                }
                onPointerOut={on_pointer_up}

                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,

                    touchAction: "pinch-zoom"
                }}

                aria-label="drawing canvas"
            />
        </div>
    );
});

export default SketchCanvas;

// TODO: make canvas capture and drawing methods generic to be reused
// TODO: simplify structure (possibly extract methods)
// TODO: make standard method for getContext that enforces willReadFrequently
// TODO: document methods and props!
// TODO: more advanced undo/redo tree? gets complex quick! at least have some form of stack. means will have to rework how canvas state is captured
// TODO: make pressure sensitivity rate change in respect to existing radius to a degree. the modifier doesn't feel right on larger pens
