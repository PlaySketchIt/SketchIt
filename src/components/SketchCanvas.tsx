import { Component, createRef } from "react";
import DynamicCursor from "../DynamicCursor";

export interface PressureSensitiveCanvasProps {
    width?: number;
    height?: number;

    min_radius?: number;
    max_radius?: number;
    init_radius?: number;

    init_bg: string;

    pressure_sensitive?: boolean;

    scroll_step?: number;
}

// TODO: unify props into pen color

class SketchCanvas extends Component<PressureSensitiveCanvasProps> {
    private canvas_ref = createRef<HTMLCanvasElement>();
    private cursor = new DynamicCursor({
        max_radius: this.props.max_radius ?? 10,
        init_radius: this.props.init_radius ?? 5,
    });

    state = {
        fg_color: "red",
        pen_radius: this.props.init_radius ?? 5,

        pen_down: false,
    };

    
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


    on_mouse_down = (_e) => {
        this.setState({ pen_down: true });
    }

    on_mouse_move = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!this.state.pen_down) return;

        const canvas = this.canvas_ref.current!;
        const ctx = canvas.getContext("2d")!;

        const rect = canvas.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, this.state.pen_radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    on_mouse_up = (_e) => {
        this.setState({ pen_down: false });
    }


    radius_in_range(radius: number) {
        return radius >= (this.props.min_radius ?? 1) && radius <= (this.props.max_radius ?? 10);
    }

    //on_scroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
    on_scroll = (e: WheelEvent) => {
        e.preventDefault();

        const delta = -e.deltaY;
        const new_radius = this.state.pen_radius + delta / 100 * (this.props.scroll_step ?? 1);

        if (!this.radius_in_range(new_radius)) return;
        console.log(new_radius);

        this.setState({ pen_radius: new_radius });
    }


    render() {
        return (
            <canvas
                className="sketch-canvas"
                ref={this.canvas_ref}

                width={this.props.width}
                height={this.props.height}

                onMouseDown={this.on_mouse_down}
                onMouseMove={this.on_mouse_move}
                onMouseUp={this.on_mouse_up}

                //onWheel={this.on_scroll}
            />
        );
    }
}

export default SketchCanvas;

// TODO: handle pressure
