const TableCell = ({ isHeader, children, className = "", colSpan, colspan }) => {
    const span = colSpan || colspan;
    return isHeader ? (
        <th className={`px-4 py-3.5 text-xs uppercase tracking-wider font-bold text-text-secondary ${className}`} colSpan={span}>
            {children}
        </th>
    ) : (
        <td className={`px-4 py-3.5 text-sm text-text-primary ${className}`} colSpan={span}>
            {children}
        </td>
    );
};

export default TableCell;

