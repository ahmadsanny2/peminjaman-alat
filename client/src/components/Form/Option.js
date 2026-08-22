const Option = ({ optionValue, optionName }) => {
    return (
        <option className="bg-card-bg text-text-primary" value={optionValue}>{optionName}</option>
    )
}

export default Option