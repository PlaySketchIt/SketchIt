import { useState } from "react";

import SketchCanvas, { SketchCanvasProps } from "./SketchCanvas";
import ColorTray from "./ColorTray";

export interface SketchAreaProps extends Omit<SketchCanvasProps, "fg_color"> {
    scroll_step?: number;
    color_box_size?: number;
}

const SketchArea: React.FC<SketchAreaProps> = (props) => {
    const min_radius = props.min_radius ?? 1;
    const max_radius = props.max_radius ?? 10;

    const [pen_radius, setPenRadius] = useState(props.pen_radius);
    const [fg_color, setFgColor] = useState("#000000");

    const scroll_step = props.scroll_step ?? 1;

    const on_scroll_wheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const delta = -e.deltaY;
        const new_radius = pen_radius + delta / 100 * scroll_step;

        if (new_radius < min_radius || new_radius > max_radius) return;
        console.log(new_radius);

        setPenRadius(new_radius);
    };

    return (
        <div className="sketch-area" onWheel={on_scroll_wheel}>
            <SketchCanvas
                init_bg={props.init_bg}

                fg_color={fg_color}

                width={props.width}
                height={props.height}

                min_radius={min_radius}
                max_radius={max_radius}
                pen_radius={pen_radius}

                pressure_sensitive={props.pressure_sensitive}
            />
            <ColorTray
                init_color={fg_color}
                on_color_change={setFgColor}
                box_size={props.color_box_size}
            />
        </div>
    );
};

export default SketchArea;
