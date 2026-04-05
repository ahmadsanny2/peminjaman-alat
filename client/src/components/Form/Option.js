const Option = ({ optionValue, optionName }) => {
    return (
        <option className="text-black" value={optionValue}>{optionName}</option>
    )
}

export default Option