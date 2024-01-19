import { useRef, useEffect } from "react";

import SketchCanvas, { SketchCanvasRef } from "./SketchCanvas";
import SketchTrays, { SketchTraysProps, SketchTraysRef } from "./SketchTrays";

export interface SketchAreaProps extends Omit<SketchTraysProps, "sketch_canvas_ref_curr"> {

}

const SketchArea: React.FC<SketchAreaProps> = (props) => {
    const sketch_canvas_ref = useRef<SketchCanvasRef>(null);
    const sketch_trays_ref = useRef<SketchTraysRef>(null);

    return (
        <div
            className="sketch-area"
            style={{
                display: "flex",
            }}
            onWheel={(e) => {
                if (sketch_trays_ref.current === null) return;

                sketch_trays_ref.current.scroll_handler(e);
            }}
        >
            <SketchCanvas
                ref={sketch_canvas_ref}
                background={props.background}

                fg_color={fg_color}
                alpha={alpha}

                current_tool={current_tool}

                width={props.width}
                height={props.height}

                min_radius={min_radius}
                max_radius={max_radius}
                brush_radius={brush_radius}

                fill_tolerance={fill_tolerance}

                pressure_modifier={props.pressure_modifier}

                undo_steps={props.undo_steps}
            />
            <SketchTrays
                ref={sketch_trays_ref}
                sketch_canvas_ref_curr={sketch_canvas_ref.current}

                init_color={props.init_color}
                init_alpha={props.init_alpha}
                init_radius={props.init_radius}
                init_tolerance={props.init_tolerance}
                init_tool={props.init_tool}

                scroll_step={props.scroll_step}
                tolerance_step={props.tolerance_step}
            />
        </div>
    );
};

export default SketchArea;
