export interface ColorTrayOptionProps {
    name: string;
    value: string;

    size?: number;

    current_color: string;

    color_change_handler: (color: string) => void;
}

const ColorTrayOption: React.FC<ColorTrayOptionProps> = (props) => {
    const classes = props.value === props.current_color ? "color-tray-option color-tray-option-selected tray-option tray-option-selected" : "color-tray-option tray-option";

    return (
        <button
            className={classes}

            aria-label={"select " + props.name + " color"}

            style={{
                backgroundColor: props.value,

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            onClick={() => props.color_change_handler(props.value)}
        >
        </button>
    );
};

export default ColorTrayOption;

// TODO: tooltip using names
