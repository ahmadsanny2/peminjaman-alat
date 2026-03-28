const TextArea = ({ type, name, value, onChange, rows, className, placeholder, disabled }) => {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className={`w-full text-gray-900 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm resize-none ${className}`}
            placeholder={placeholder}
            disabled={disabled}
        />
    )
}

export default TextArea