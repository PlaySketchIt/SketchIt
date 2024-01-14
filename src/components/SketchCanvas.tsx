import { Component, createRef } from "react";
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

class SketchCanvas extends Component<SketchCanvasProps> {
    private min_radius = this.props.min_radius ?? 1;
    private max_radius = this.props.max_radius ?? 10;
    private init_radius = this.props.init_radius ?? 5;

    private canvas_ref = createRef<HTMLCanvasElement>();
    private cursor = new DynamicCursor({
        max_radius: this.max_radius,
        init_radius: this.init_radius
    });

    state = {
        fg_color: "red",
        pen_radius: this.init_radius,

        pen_down: false,
    };


    clamp_radius(radius: number) {
        return Math.min(Math.max(radius, this.min_radius), this.max_radius);
    }

    
    load_css_cursor() {
        this.cursor.set_fill(this.state.fg_color);
        this.cursor.set_radius(this.state.pen_radius);

        this.canvas_ref.current!.style.cursor = this.cursor.as_css_cursor("crosshair");
    }


    componentDidMount() {
        console.log("canvas mounted");

        const canvas = this.canvas_ref.current!;
        const ctx = canvas.getContext("2d")!;

        // initialise canvas
        ctx.fillStyle = this.props.init_bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // change to foreground color
        ctx.fillStyle = this.state.fg_color;

        this.load_css_cursor();

        // has to register here so scrolling can be prevented
        this.canvas_ref.current!.addEventListener("wheel", this.on_scroll, { passive: false });
    }

    componentDidUpdate() {
        // update css cursor if values change
        this.load_css_cursor();
    }


    on_pen_down = () => {
        this.setState({ pen_down: true });
    };

    on_pen_move = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!this.state.pen_down) return;

        const canvas = this.canvas_ref.current!;
        const ctx = canvas.getContext("2d")!;

        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        let effective_radius = this.state.pen_radius;

        if (this.props.pressure_sensitive && e.pointerType === "pen") {
            let adjusted_pressure = e.pressure;

            if (e.pressure < 1) {
                // some tablets tend to be a bit weak at the high zones, so add a little boost
                adjusted_pressure = e.pressure += 0.1;
            }

            // TODO: decide if base radius acts as multiplier (like now) or as a minimum that gets added to

            effective_radius = this.clamp_radius(this.state.pen_radius * adjusted_pressure);
        }

        ctx.beginPath();
        ctx.arc(x, y, effective_radius, 0, 2 * Math.PI);
        ctx.fill();
    };

    on_pen_up = () => {
        this.setState({ pen_down: false });
    };

    //on_scroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
    on_scroll = (e: WheelEvent) => {
        e.preventDefault();

        const delta = -e.deltaY;
        const new_radius = this.state.pen_radius + delta / 100 * (this.props.scroll_step ?? 1);

        if (new_radius < this.min_radius || new_radius > this.max_radius) return;
        console.log(new_radius);

        this.setState({ pen_radius: new_radius });
    };


    render() {
        return (
            <canvas
                className="sketch-canvas"
                ref={this.canvas_ref}

                width={this.props.width}
                height={this.props.height}

                onPointerDown={this.on_pen_down}
                onPointerMove={this.on_pen_move}
                onPointerUp={this.on_pen_up}

                onPointerOut={this.on_pen_up}

                //onWheel={this.on_scroll}
            />
        );
    }
}

export default SketchCanvas;
