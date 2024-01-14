export interface ColorTrayOptionProps {
    value: string;
    size?: number;

    color_change: (color: string) => void;
}

const ColorTrayOption: React.FC<ColorTrayOptionProps> = (props) => {
    return (
        <button
            className="color-tray-option"
            style={{
                backgroundColor: props.value,

                border: "1px solid black",

                width: props.size ?? 20,
                height: props.size ?? 20
            }}

            onClick={() => props.color_change(props.value)}
        >
        </button>
    );
};

export default ColorTrayOption;
