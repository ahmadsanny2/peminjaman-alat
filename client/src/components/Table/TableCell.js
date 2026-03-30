const TableCell = ({ isHeader, children, className, colspan }) => {
    return isHeader ? (
        <th className={`border-slate-200 px-3 py-4 border ${className}`}>{children}</th>
    ) : (
        <td className={`border-slate-200 px-3 py-4 border ${className}`}
            colSpan={colspan}
        >
            {children}
        </td>
    );
};

export default TableCell;
