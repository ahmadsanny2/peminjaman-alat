const Select = ({ name, value, onChange, className, disabled, children }) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full pl-9 p-2.5 border rounded-lg text-sm text-slate-700 ${className}`}
            disabled={disabled}
        >
            {children}
        </select>
    )
}

export default Select