const StatusBadge = ({ status }) => {
    const config = {
        pending: {
            color: "bg-amber-100 text-amber-700 border-amber-200",
            label: "Menunggu Persetujuan", // Khusus Pengajuan Awal
        },
        approved: {
            color: "bg-blue-100 text-blue-700 border-blue-200",
            label: "Dipinjam",
        },
        verifying: {
            color: "bg-purple-100 text-purple-700 border-purple-200",
            label: "Menunggu Verifikasi", // Khusus Proses Pengembalian
        },
        returned: {
            color: "bg-emerald-100 text-emerald-700 border-emerald-200",
            label: "Dikembalikan",
        },
        rejected: {
            color: "bg-red-100 text-red-700 border-red-200",
            label: "Ditolak",
        },
    };
    const current = config[status] || {
        color: "bg-slate-100 text-slate-700 border-slate-200",
        label: "Dibatalkan",
    };
    return (
        <span
            className={`px-4 py-2 text-xs font-semibold rounded-full border ${current.color}`}
        >
            {current.label}
        </span>
    )
}

export default StatusBadge