const ActionButton = ({ title, onClick, className, icon, name, disabled, color = "indigo" }) => {
    const colorVariants = {
        emerald: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:bg-emerald-50 disabled:text-emerald-300",
        rose: "bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:bg-rose-50 disabled:text-rose-300",
        indigo: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:bg-indigo-50 disabled:text-indigo-300",
        amber: "bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:bg-amber-50 disabled:text-amber-300",
        slate: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-300",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-full cursor-pointer disabled:cursor-not-allowed font-semibold transition-all duration-200 ${colorVariants[color]} ${className}`}
            title={title}
        >
            <div className="flex items-center justify-center gap-2 text-sm">
                {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
                <span>{name}</span>
            </div>
        </button>
    );
};

export default ActionButton;