export interface DynamicCursorProps {
    fill?: string;
    stroke?: string;
    stroke_width?: number;

    init_radius?: number;
    max_radius?: number;
}

class DynamicCursor {
    #svg: SVGSVGElement;
    #circle: SVGCircleElement;

    constructor(props?: DynamicCursorProps) {
        if (!props) props = {};
        if (!props.fill) props.fill = "red";
        if (!props.stroke) props.stroke = "black";
        if (!props.stroke_width) props.stroke_width = 1;
        if (!props.init_radius) props.init_radius = 5;
        if (!props.max_radius) props.max_radius = 20;

        // needs to fit the diameter of the circle and stroke
        const svg_length = props.max_radius * 2 + props.stroke_width * 2;

        this.#svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.#svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.#svg.setAttribute("version", "1.1");
        this.#svg.setAttribute("width", String(svg_length));
        this.#svg.setAttribute("height", String(svg_length));

        this.#circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.#circle.setAttribute("cx", String(svg_length / 2));
        this.#circle.setAttribute("cy", String(svg_length / 2));
        this.#circle.setAttribute("r", String(props.init_radius));
        this.#circle.setAttribute("fill", props.fill);
        this.#circle.setAttribute("stroke", props.stroke);
        this.#circle.setAttribute("stroke-width", String(props.stroke_width));

        this.#svg.appendChild(this.#circle);
    }

    set_fill(fill: string) {
        this.#circle.setAttribute("fill", fill);
    }

    set_stroke(stroke: string) {
        this.#circle.setAttribute("stroke", stroke);
    }

    set_stroke_width(stroke_width: number) {
        this.#circle.setAttribute("stroke-width", String(stroke_width));
    }

    set_radius(radius: number) {
        this.#circle.setAttribute("r", String(radius));
    }


    as_data_url() {
        const xml = new XMLSerializer().serializeToString(this.#svg);

        const header = "data:image/svg+xml,";
        const data = header + encodeURIComponent(xml);

        return data;
    }

    as_css_cursor(fallback: string = "default") {
        const data = this.as_data_url();

        const center = this.#circle.getAttribute("cx") + " " + this.#circle.getAttribute("cy");
        const css = `url(${data}) ${center}, ${fallback}`;

        return css;
    }
}

export default DynamicCursor;
