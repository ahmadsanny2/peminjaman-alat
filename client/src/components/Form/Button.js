const Button = ({ disabled, name, cancel, icon, buttonType, onClick }) => {
    const bgColor = cancel
        ? "bg-red-600 hover:bg-red-700 p-3"
        : "flex-1 bg-blue-600 hover:bg-blue-700";

    const type = buttonType ? "button" : "submit"

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${bgColor} text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
        >
            {name || icon}
        </button>
    );
};

export default Button;