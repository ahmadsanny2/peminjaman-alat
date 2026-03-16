const StatusBadge = ({status}) => {
    const config = {
        pending: {
            color: "bg-amber-100 text-amber-700 border-amber-200",
            label: "Menunggu Persetujuan",
        },
        approved: {
            color: "bg-blue-100 text-blue-700 border-blue-200",
            label: "Sedang Dipinjam",
        },
        returned: {
            color: "bg-emerald-100 text-emerald-700 border-emerald-200",
            label: "Telah Dikembalikan",
        },
        rejected: {
            color: "bg-red-100 text-red-700 border-red-200",
            label: "Pengajuan Ditolak",
        },
    };
    const current = config[status] || {
        color: "bg-slate-100 text-slate-700",
        label: "Status tidak diketahui",
    };
    return (
        <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${current.color}`}
        >
            {current.label}
        </span>
    )
}

export default StatusBadge