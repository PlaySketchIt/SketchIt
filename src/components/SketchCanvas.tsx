import { useRef, useEffect, useState, useCallback } from "react";
import DynamicCursor from "../DynamicCursor";


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

    init_bg: string;

    alpha: number;
    fg_color: string;

    current_tool: SketchTool;

    pressure_sensitive?: boolean;
}

const SketchCanvas: React.FC<SketchCanvasProps> = (props) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursor = useRef(new DynamicCursor({
        max_radius: max_radius,
        init_radius: props.pen_radius, // TODO: option to resize based on calculated pressure
        stroke: "rgba(0, 0, 0, 0.5)",
        stroke_width: 1.5 // TODO: option to make size consistent with radius (also consider viewport)
    }));

    const [initialised, setInitialised] = useState(false);
    const [pen_down, setPenDown] = useState(false);


    const clamp_radius = (radius: number) => {
        return Math.min(Math.max(radius, min_radius), max_radius);
    };

    const load_css_cursor = useCallback(() => {
        if (props.current_tool === "fill") {
            // TODO: custom fill cursor
            if (canvasRef.current) {
                canvasRef.current.style.cursor = "crosshair";
            }

            return;
        }

        // TODO: as additional tools added, migrate to switch statement

        cursor.current.set_fill(props.fg_color ?? "black");
        cursor.current.set_radius(props.pen_radius);

        if (canvasRef.current) {
            canvasRef.current.style.cursor = cursor.current.as_css_cursor("crosshair");
        }
    }, [props.fg_color, props.pen_radius, props.current_tool]);


    const last_line = useRef<{ x: number, y: number, r: number }[]>([]);
    const last_canvas_state = useRef<ImageData | null>(null);

    const on_pointer_move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });

        if (canvas && ctx) {
            const rect = canvas.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let effective_radius = props.pen_radius;

            if (props.pressure_sensitive && e.pointerType === "pen") {
                let adjusted_pressure = e.pressure;

                if (e.pressure < 1) {
                    // some tablets tend to be a bit weak at the high zones, so add a little boost
                    adjusted_pressure = e.pressure += 0.1;
                }

                // TODO: decide if base radius acts as multiplier (like now) or as a minimum that gets added to

                effective_radius = clamp_radius(props.pen_radius * adjusted_pressure);
            }

            const draw = () => {
                ctx.beginPath();

                const previous_point = last_line.current[last_line.current.length - 1];

                if (previous_point) {
                    // enforce minimum distance between points
                    // this helps optimise performance, especially when networked
                    // it also makes the pre-fixup transparency a little clearer
                    const dist = Math.sqrt((x - previous_point.x) ** 2 + (y - previous_point.y) ** 2);

                    // could use diameter to avoid any overlap, but it doesn't look as smooth
                    // TODO: should this be configurable? e.g. props.radius_overlap
                    if (dist < effective_radius) {
                        // don't draw anything
                        return;
                    }

                    // this line is merely a preview
                    ctx.moveTo(previous_point.x, previous_point.y);
                    ctx.lineTo(x, y);

                    ctx.lineWidth = effective_radius * 2;
                    ctx.stroke();
                } else {
                    // this is just a dot with no movement
                    ctx.arc(x, y, effective_radius, 0, 2 * Math.PI);
                    ctx.fill();
                }

                last_line.current.push({ x, y, r: effective_radius });
            };

            //requestAnimationFrame(draw);
            draw();
        }
    };

    const on_pointer_down = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (props.current_tool === "fill") {
            // TODO: flood fill algo
            return;
        }

        // TODO: as additional tools added, migrate to switch statement

        // save canvas state for undo/transparency fixup
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });

        if (canvas && ctx) {
            last_canvas_state.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        // prepare last line for transparency fixup
        last_line.current = [];

        setPenDown(true);

        // simulate movement to draw first dot
        on_pointer_move(e);
    };

    const on_pointer_up = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        setPenDown(false);

        // simulate movement to draw last dot
        on_pointer_move(e);

        // perform transparency fixup
        // revert canvas state and redraw last line as a single path
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });

        if (canvas && ctx) {
            if (last_canvas_state.current) {
                ctx.putImageData(last_canvas_state.current, 0, 0);
            }

            if (last_line.current.length > 1) {
                ctx.beginPath();

                ctx.moveTo(last_line.current[0].x, last_line.current[0].y);

                for (let i = 1; i < last_line.current.length; i++) {
                    const point = last_line.current[i];
                    ctx.lineTo(point.x, point.y);
                }

                ctx.lineWidth = last_line.current[0].r * 2;
                ctx.stroke();
            }
        }

        // recapture new state for undo
        if (canvas && ctx) {
            last_canvas_state.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    };


    // effect: run at mount time to initialise canvas and cursor
    useEffect(() => {
        if (initialised) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (ctx) {
            // initialise canvas
            ctx.fillStyle = props.init_bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            // change to foreground color
            ctx.fillStyle = props.fg_color;
            ctx.strokeStyle = props.fg_color;

            load_css_cursor();
        }

        setInitialised(true);

    }, [initialised, props.init_bg, props.fg_color, load_css_cursor]);


    // effect: run when color/radius/tool changes to update cursor
    useEffect(() => {
        load_css_cursor();
    }, [load_css_cursor]);


    // effect: run when color changes to update canvas color
    useEffect(() => {
        console.log("fg color changed");

        // update canvas color if value changes
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.fillStyle = props.fg_color;
        ctx.strokeStyle = props.fg_color;
    }, [props.fg_color]);


    // effect: run when alpha changes to update canvas global alpha
    useEffect(() => {
        // update canvas alpha if value changes
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.globalAlpha = props.alpha;
    }, [props.alpha]);

    return (
        <canvas
            className="sketch-canvas"
            ref={canvasRef}

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
                touchAction: "pinch-zoom"
            }}
        />
    );
};

export default SketchCanvas;

// TODO: make canvas capture and drawing methods generic to be reused
// TODO: simplify structure (possibly extract methods)
// TODO: make standard method for getContext that enforces willReadFrequently
