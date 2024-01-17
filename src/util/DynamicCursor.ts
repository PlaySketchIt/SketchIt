export interface DynamicCursorProps {
    fill?: string;

    outer_stroke?: string;
    outer_stroke_width?: number;

    inner_stroke?: string;
    inner_stroke_width?: number;

    init_radius?: number;
    max_radius?: number;
}

class DynamicCursor {
    #svg: SVGSVGElement;
    #outer_circle: SVGCircleElement;
    #inner_circle: SVGCircleElement;

    constructor(props?: DynamicCursorProps) {
        if (!props) props = {};
        if (!props.fill) props.fill = "red";
        if (!props.outer_stroke) props.outer_stroke = "black";
        if (!props.outer_stroke_width) props.outer_stroke_width = 1;
        if (!props.inner_stroke) props.inner_stroke = "white";
        if (!props.inner_stroke_width) props.inner_stroke_width = 1;
        if (!props.init_radius) props.init_radius = 5;
        if (!props.max_radius) props.max_radius = 20;

        // needs to fit the diameter of the circle and stroke
        const svg_length = props.max_radius * 2 + props.outer_stroke_width * 2;

        this.#svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.#svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.#svg.setAttribute("version", "1.1");
        this.#svg.setAttribute("width", String(svg_length));
        this.#svg.setAttribute("height", String(svg_length));

        this.#outer_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.#outer_circle.setAttribute("cx", String(svg_length / 2));
        this.#outer_circle.setAttribute("cy", String(svg_length / 2));
        this.#outer_circle.setAttribute("r", String(props.init_radius));
        this.#outer_circle.setAttribute("stroke", props.outer_stroke);
        this.#outer_circle.setAttribute("stroke-width", String(props.outer_stroke_width));
        this.#svg.appendChild(this.#outer_circle);

        this.#inner_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.#inner_circle.setAttribute("cx", String(svg_length / 2));
        this.#inner_circle.setAttribute("cy", String(svg_length / 2));
        this.#inner_circle.setAttribute("r", String(props.init_radius - props.inner_stroke_width));
        this.#inner_circle.setAttribute("fill", props.fill);
        this.#inner_circle.setAttribute("stroke", props.inner_stroke);
        this.#inner_circle.setAttribute("stroke-width", String(props.inner_stroke_width));
        this.#svg.appendChild(this.#inner_circle);
    }

    set_fill(fill: string) {
        this.#inner_circle.setAttribute("fill", fill);
    }

    set_outer_stroke(stroke: string) {
        this.#outer_circle.setAttribute("stroke", stroke);
    }

    set_outer_stroke_width(stroke_width: number) {
        this.#outer_circle.setAttribute("stroke-width", String(stroke_width));
    }

    set_inner_stroke(stroke: string) {
        this.#inner_circle.setAttribute("stroke", stroke);
    }

    set_inner_stroke_width(stroke_width: number) {
        this.#inner_circle.setAttribute("stroke-width", String(stroke_width));
    }

    set_radius(radius: number) {
        this.#outer_circle.setAttribute("r", String(radius));
    }


    as_data_url() {
        const xml = new XMLSerializer().serializeToString(this.#svg);

        const header = "data:image/svg+xml,";
        const data = header + encodeURIComponent(xml);

        return data;
    }

    as_css_cursor(fallback: string = "default") {
        const data = this.as_data_url();

        const center = this.#outer_circle.getAttribute("cx") + " " + this.#outer_circle.getAttribute("cy");
        const css = `url(${data}) ${center}, ${fallback}`;

        return css;
    }
}

export default DynamicCursor;
