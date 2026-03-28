const Input = ({ type, name, value, onChange, className, placeholder, disabled }) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full text-gray-900 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm border-slate-300 ${className}`}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}

export default Input