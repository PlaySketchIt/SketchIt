import { useRef, useEffect, useState, useCallback } from "react";
import DynamicCursor from "../DynamicCursor";

// using fake enum rather than real enum as exporting enum invalidates fast refresh
export type SketchTool = "pen" | "fill";

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
        init_radius: props.pen_radius
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


    const last_point = useRef<{ x: number, y: number } | null>(null);

    const on_pointer_move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

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

                if (last_point.current) {
                    // check if moved more than the diameter (to avoid overlap when transparent)
                    const dx = x - last_point.current.x;
                    const dy = y - last_point.current.y;

                    const delta = Math.sqrt(dx * dx + dy * dy);

                    // TODO: this helps to a degree, but makes it look laggy when the radius is large
                    if (delta < effective_radius * 2) {
                        // not enough movement to draw without overlap
                        return;
                    }

                    ctx.moveTo(last_point.current.x, last_point.current.y);
                    ctx.lineTo(x, y);
                    
                    ctx.lineWidth = effective_radius * 2;
                    ctx.stroke();
                } else {
                    // this is just a dot with no movement
                    ctx.arc(x, y, effective_radius, 0, 2 * Math.PI);
                    ctx.fill();
                }

                last_point.current = { x, y };
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

        setPenDown(true);

        // simulate movement to draw first dot
        on_pointer_move(e);
    };

    const on_pointer_up = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        setPenDown(false);

        // simulate movement to draw last dot
        on_pointer_move(e);

        // clear last point
        last_point.current = null;
    };

    useEffect(() => {
        if (initialised) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

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

    useEffect(() => {
        // update css cursor if values change
        load_css_cursor();
    }, [load_css_cursor]);

    useEffect(() => {
        console.log("fg color changed");

        // update canvas color if value changes
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = props.fg_color;
        ctx.strokeStyle = props.fg_color;
    }, [props.fg_color]);

    useEffect(() => {
        // update canvas alpha if value changes
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
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

// TODO: fix weird alpha behaviour (e.g. overlapping over self if slow, visible line ending overlap etc)
// may have to adjust drawing algo to only draw a line if moved enough, rather than on every move
// http://literallycanvas.com/
// https://github.com/literallycanvas/literallycanvas-core/tree/master/src
