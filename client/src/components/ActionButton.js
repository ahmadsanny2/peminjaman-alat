const ActionButton = ({ title, onClick, className, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`p-1 rounded-lg cursor-pointer ${className}`}
            title={title}
        >
            {icon}
        </button>
    )
}

export default ActionButton