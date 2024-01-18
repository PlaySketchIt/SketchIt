import { forwardRef, useRef, useEffect, useState, useCallback, useImperativeHandle } from "react";

import FloodFill from "q-floodfill";

import type { HexColor } from "../ColorTrayOption";

import DynamicCursor from "./DynamicCursor";
import CanvasUndoRedoArray from "./CanvasUndoRedoArray";

// TODO: move definitions into separate file

// using fake enum rather than real enum as exporting enum invalidates fast refresh
export type SketchTool = "brush" | "fill";
export type SketchCommand = "undo" | "redo" | "clear";

export interface SketchCanvasProps {
    width?: number;
    height?: number;

    min_radius?: number;
    max_radius?: number;
    brush_radius: number;

    fill_tolerance: number;

    background: string;

    alpha: number;
    fg_color: HexColor;

    current_tool: SketchTool;

    pressure_modifier: number; // multiplied by pressure (0-1) then added to brush radius, e.g. a modifier of 2 adds 2 radius to the brush at full pressure. no longer clamped to maximum radius.

    undo_steps?: number;
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

    // TODO: could check brush radius is within min/max radius. could be exbrushsive though and not really necessary
    //const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const render_canvas_ref = useRef<HTMLCanvasElement>(null);
    const draw_canvas_ref = useRef<HTMLCanvasElement>(null);

    const undo_redo_array = useRef(new CanvasUndoRedoArray(props.undo_steps));

    const get_adjusted_radius = useCallback((radius: number) => {
        // adjust radius to account for canvas scaling
        const draw_canvas = draw_canvas_ref.current;
        if (!draw_canvas) return radius;

        const rect = draw_canvas.getBoundingClientRect();
        return radius * rect.width / draw_canvas.width;
        //return radius * rect.width / document.documentElement.clientWidth;
        // TODO: which works best? i don't know how well either is working. we don't want to express radius in web px, but rather in terms of the canvas's pixels
    }, []);

    const cursor = useRef(new DynamicCursor({
        max_radius: max_radius,
        init_radius: get_adjusted_radius(props.brush_radius), // TODO: option to resize based on calculated pressure
        inner_stroke: "#ffffffaa",
        inner_stroke_width: 1,
        outer_stroke: "#00000080",
        outer_stroke_width: 1.5 // TODO: option to make size consistent with radius (also consider viewport)
    }));

    const [brush_down, setBrushDown] = useState<boolean>(false);

    const load_css_cursor = useCallback(() => {
        if (props.current_tool === "fill") {
            // TODO: custom fill cursor
            if (draw_canvas_ref.current) {
                draw_canvas_ref.current.style.cursor = "crosshair";
            }

            return;
        }

        // TODO: as additional tools added, migrate to switch statement

        cursor.current.set_fill(props.fg_color);
        cursor.current.set_fill_alpha(props.alpha);
        cursor.current.set_radius(get_adjusted_radius(props.brush_radius));

        if (draw_canvas_ref.current) {
            draw_canvas_ref.current.style.cursor = cursor.current.as_css_cursor("crosshair");
        }
    }, [props.fg_color, props.alpha, props.brush_radius, props.current_tool, get_adjusted_radius]);

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
        if (!brush_down) return;

        const draw_canvas = draw_canvas_ref.current;
        const draw_ctx = draw_canvas?.getContext("2d", { willReadFrequently: true });

        if (draw_canvas && draw_ctx) {
            // get x and y, adjusted for canvas viewport position AND SCALE
            const rect = draw_canvas.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width * draw_canvas.width;
            const y = (e.clientY - rect.top) / rect.height * draw_canvas.height;

            let effective_radius = props.brush_radius;

            if (props.pressure_modifier !== 0 && e.pointerType === "pen") {
                let adjusted_pressure = e.pressure;

                if (e.pressure < 1) {
                    // some tablets tend to be a bit weak at the high zones, so add a little boost
                    adjusted_pressure = e.pressure += 0.1;
                }

                effective_radius = props.brush_radius + (props.pressure_modifier * adjusted_pressure);
            }

            // adjust radius to account for canvas scaling
            effective_radius = get_adjusted_radius(effective_radius);

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
        if (props.current_tool === "fill") {
            const canvas = draw_canvas_ref.current;

            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            do_floodfill(x, y);

            // have to do capture here as the on_pointer_up event doesn't fire if using fill tool
            undo_redo_array.current.capture_from_canvas(render_canvas_ref.current!);
            return;
        }

        // TODO: as additional tools added, migrate to switch statement

        previous_point.current = null;

        setBrushDown(true);

        // simulate movement to draw first dot
        on_pointer_move(e);
    };

    const on_pointer_up = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!brush_down) return;

        setBrushDown(false);

        // simulate movement to draw last dot
        on_pointer_move(e);

        // overlay draw canvas as required then clear it
        composite_draw_canvas_on_render();
        clear_draw_canvas();

        // capture render canvas state for undo/redo
        undo_redo_array.current.capture_from_canvas(render_canvas_ref.current!);
    };


    const composite_draw_canvas_on_render = () => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        const draw_canvas = draw_canvas_ref.current;

        if (!render_canvas || !render_ctx || !draw_canvas) return;
        // TODO: don't silently fail

        //render_ctx.globalAlpha = props.alpha; // this is now set by an effect automatically
        render_ctx.drawImage(draw_canvas, 0, 0);

        // TODO: should the method be changed to return new composite image data but not actually apply it? could then be reused for networking
        // TODO: should this method just call the clear method, or do we trust the caller to do it?
    };


    const clear_render_canvas = useCallback(() => {
        const render_canvas = render_canvas_ref.current;
        const render_ctx = render_canvas?.getContext("2d", { willReadFrequently: true });

        if (!render_canvas || !render_ctx) return;

        render_ctx.globalAlpha = 1;

        render_ctx.fillStyle = props.background;
        render_ctx.fillRect(0, 0, render_canvas.width, render_canvas.height);

        render_ctx.globalAlpha = props.alpha;
    }, [props.background, props.alpha]);

    const clear_draw_canvas = useCallback(() => {
        const draw_canvas = draw_canvas_ref.current;
        const draw_ctx = draw_canvas?.getContext("2d", { willReadFrequently: true });

        if (!draw_canvas || !draw_ctx) return;

        draw_ctx.clearRect(0, 0, draw_canvas.width, draw_canvas.height);
    }, []);


    // effect: run ONCE at mount time to initialise canvas and cursor
    const initialised = useRef<boolean>(false);
    useEffect(() => {
        if (initialised.current) return;

        const draw_canvas = draw_canvas_ref.current;
        if (!draw_canvas) return;

        const draw_ctx = draw_canvas.getContext("2d", { willReadFrequently: true });

        if (draw_ctx) {
            // initialise canvases
            clear_draw_canvas();
            clear_render_canvas();

            undo_redo_array.current.capture_from_canvas(render_canvas_ref.current!);

            draw_ctx.lineCap = "round";
            draw_ctx.lineJoin = "round";

            draw_ctx.strokeStyle = props.fg_color;
            draw_ctx.fillStyle = props.fg_color;

            load_css_cursor();
        }

        initialised.current = true;
    }, [initialised, load_css_cursor, clear_draw_canvas, clear_render_canvas, props.fg_color]);


    // effect: run when color/radius/tool/alpha changes to update cursor
    useEffect(() => {
        load_css_cursor();
    }, [load_css_cursor]);

    // effect: if window width changes, reload cursor to recalculate adjusted radius
    useEffect(() => {
        // TODO: why isn't this scaling properly? it is clearly proportional to the canvas size to an extent,
        // but not exactly as is the case with pen size. test shows its receiving the correct values
        // it may be because the value of the radius in terms of the canvas is still different than the dom. needs additional adjustment to be used with cursor?
        window.addEventListener("resize", load_css_cursor);

        return () => {
            window.removeEventListener("resize", load_css_cursor);
        };
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
                    if (!undo_redo_array.current.can_undo) return;

                    undo_redo_array.current.undo_onto_canvas(render_canvas_ref.current!);
                    break;
                case "redo":
                    if (!undo_redo_array.current.can_redo) return;

                    undo_redo_array.current.redo_onto_canvas(render_canvas_ref.current!);
                    break;
                case "clear":
                    clear_render_canvas();
                    undo_redo_array.current.capture_from_canvas(render_canvas_ref.current!);
                    break;
            }
        },
        set_on_undo_enabled_change: (callback: (can_undo: boolean) => void) => {
            undo_redo_array.current.on_can_undo_change = callback;
        },
        set_on_redo_enabled_change: (callback: (can_redo: boolean) => void) => {
            undo_redo_array.current.on_can_redo_change = callback;
        }
        // TODO: this cannot be the best way to do this. passing boolean directly doesn't update the parent though
    }), [clear_render_canvas]);

    return (
        <div
            className="sketch-canvas"

            style={{
                position: "relative",

                objectFit: "contain",
                width: "100%",
                height: "100%",
                aspectRatio: `${props.width} / ${props.height}`,
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
                    left: 0,

                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    aspectRatio: `${props.width} / ${props.height}`,
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
                            setBrushDown(true);
                        }
                    }
                }
                onPointerOut={on_pointer_up}

                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,

                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    aspectRatio: `${props.width} / ${props.height}`,

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
// TODO: more advanced undo/redo tree like in ms word? it'll get complex quickly though. i think the linear array is fine for now
// TODO: make pressure sensitivity rate change in respect to existing radius to a degree. the modifier doesn't feel right on larger brushes
// TODO: eraser tool that respects alpha?
// TODO: shape tools
// TODO: custom hook: useHexColorCheck. validates color when updated, and casts it to assert it is a valid hex color.

// networking idea: use transparency of draw canvas in order to calculate differences, then only send that. differential updates.
// fill will probably send whole frame unless we do the same fill on the client side, but might cause desync issues if some people's computers can do fills faster than others
// ^^ might not be the end of the world but worth considering. i think syncing precise brush movements and replicating is bad though. just send updates every so often.
