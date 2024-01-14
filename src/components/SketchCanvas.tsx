import { useRef, useEffect, useState, useCallback } from "react";
import DynamicCursor from "../DynamicCursor";

export interface SketchCanvasProps {
    width?: number;
    height?: number;

    min_radius?: number;
    max_radius?: number;
    init_radius?: number;

    init_bg: string;

    pressure_sensitive?: boolean; // TODO: user toggleable

    scroll_step?: number;
}

// TODO: unify props into pen color

const SketchCanvas: React.FC<SketchCanvasProps> = (props) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;
    const init_radius = props.init_radius ?? 5;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursor = useRef(new DynamicCursor({
        max_radius: max_radius,
        init_radius: init_radius
    }));

    const [initialised, setInitialised] = useState(false);
    const [fg_color, setFgColor] = useState("red");
    const [pen_radius, setPenRadius] = useState(init_radius);
    const [pen_down, setPenDown] = useState(false);


    const clamp_radius = (radius: number) => {
        return Math.min(Math.max(radius, min_radius), max_radius);
    };

    const load_css_cursor = useCallback(() => {
        cursor.current.set_fill(fg_color);
        cursor.current.set_radius(pen_radius);

        if (canvasRef.current) {
            canvasRef.current.style.cursor = cursor.current.as_css_cursor("crosshair");
        }
    }, [fg_color, pen_radius]);


    const last_point = useRef<{ x: number, y: number } | null>(null);

    const on_pen_move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!pen_down) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (canvas && ctx) {
            const rect = canvas.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let effective_radius = pen_radius;

            if (props.pressure_sensitive && e.pointerType === "pen") {
                let adjusted_pressure = e.pressure;

                if (e.pressure < 1) {
                    // some tablets tend to be a bit weak at the high zones, so add a little boost
                    adjusted_pressure = e.pressure += 0.1;
                }

                // TODO: decide if base radius acts as multiplier (like now) or as a minimum that gets added to

                effective_radius = clamp_radius(pen_radius * adjusted_pressure);
            }

            const draw = () => {
                ctx.beginPath();

                if (last_point.current) {
                    ctx.moveTo(last_point.current.x, last_point.current.y);
                    ctx.lineTo(x, y);
                    
                    ctx.lineWidth = effective_radius * 2;
                    ctx.stroke();
                } else {
                    ctx.arc(x, y, effective_radius, 0, 2 * Math.PI);
                    ctx.fill();
                }
            };
    
            //requestAnimationFrame(draw);
            draw();
            last_point.current = { x, y };
        }
    };

    const on_pen_down = (e: React.PointerEvent<HTMLCanvasElement>) => {
        setPenDown(true);

        // simulate movement to draw first dot
        on_pen_move(e);
    };

    const on_pen_up = (e: React.PointerEvent<HTMLCanvasElement>) => {
        setPenDown(false);

        // simulate movement to draw last dot
        on_pen_move(e);

        // clear last point
        last_point.current = null;
    };

    const on_scroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.stopPropagation();

        const delta = -e.deltaY;
        const new_radius = pen_radius + delta / 100 * (props.scroll_step ?? 1);

        if (new_radius < min_radius || new_radius > max_radius) return;
        console.log(new_radius);

        setPenRadius(new_radius);
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

            // change to foreground color
            ctx.fillStyle = fg_color;
            ctx.strokeStyle = fg_color;

            load_css_cursor();
        }

        setInitialised(true);

        // TODO: update fg color on color change
    }, [initialised, props.init_bg, fg_color, load_css_cursor]);

    useEffect(() => {
        // update css cursor if values change
        load_css_cursor();
    }, [load_css_cursor]);


    return (
        <canvas
            className="sketch-canvas"
            ref={canvasRef}

            width={props.width}
            height={props.height}

            onPointerDown={on_pen_down}
            onPointerMove={on_pen_move}
            onPointerUp={on_pen_up}

            onPointerOut={on_pen_up}

            onWheel={on_scroll}

            style={{
                touchAction: "pinch-zoom"
            }}
        />
    );
};

export default SketchCanvas;
