export interface ColorTrayOptionProps {
    value: string;
    size?: number;

    current_color: string;

    color_change: (color: string) => void;
}

const ColorTrayOption: React.FC<ColorTrayOptionProps> = (props) => {
    const classes = props.value === props.current_color ? "color-tray-option color-tray-option-selected tray-option tray-option-selected" : "color-tray-option tray-option";

    return (
        <button
            className={classes}

            style={{
                backgroundColor: props.value,

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            onClick={() => props.color_change(props.value)}
        >
        </button>
    );
};

export default ColorTrayOption;
