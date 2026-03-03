"use client";

import { useLoanManagement } from "@/hooks/admin/useLoanManagement";
import { ClipboardCheck, CheckCircle, Undo2, AlertCircle } from "lucide-react";

export default function PetugasValidasiPage() {

    // Loan Management Data
    const { loans, isLoading, isProcessing, error, approveLoan, returnLoan } =
        useLoanManagement();

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Status Badge
    const StatusBadge = ({ status }) => {
        const config = {
            pending: {
                color: "bg-amber-100 text-amber-700 border-amber-200",
                label: "Pending",
            },
            approved: {
                color: "bg-blue-100 text-blue-700 border-blue-200",
                label: "Borrowed",
            },
            returned: {
                color: "bg-emerald-100 text-emerald-700 border-emerald-200",
                label: "Returned",
            },
            rejected: {
                color: "bg-red-100 text-red-700 border-red-200",
                label: "Rejected",
            },
        };
        const current = config[status] || {
            color: "bg-slate-100 text-slate-700",
            label: "Anomali",
        };

        return (
            <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${current.color}`}
            >
                {current.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <ClipboardCheck className="text-emerald-600" size={28} />
                <div>
                    <h1 className="text-2xl font-bold">Daftar Peminjaman</h1>
                </div>
            </div>

            {/* Error Response */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3">
                    <AlertCircle className="mt-0.5 text-red-500" size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    {/* Loan Request History Data */}
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Peminjam</th>
                                <th className="px-6 py-4">Alat</th>
                                <th className="px-6 py-4">Tanggal Diajukan</th>
                                <th className="px-6 py-4">Tenggat Pengembalian</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-slate-500 animate-pulse"
                                    >
                                        Sedang mengambil data...
                                    </td>
                                </tr>
                            ) : loans.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-slate-500"
                                    >
                                        Riwayat daftar peminjaman alat belum ada.
                                    </td>
                                </tr>
                            ) : (
                                loans.map((loan) => (
                                    <tr
                                        key={loan.id}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">
                                                {loan.borrower?.fullName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {loan.Tool?.name}
                                        </td>
                                        <td className="px-6 py-4">{formatDate(loan.borrowDate)}</td>
                                        <td className="px-6 py-4">
                                            {formatDate(loan.expectedReturnDate)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={loan.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {loan.status === "pending" && (
                                                <button
                                                    onClick={() => approveLoan(loan.id)}
                                                    disabled={isProcessing}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium disabled:opacity-50"
                                                >
                                                    <CheckCircle size={14} /> Setujui
                                                </button>
                                            )}
                                            {loan.status === "approved" && (
                                                <button
                                                    onClick={() => returnLoan(loan.id)}
                                                    disabled={isProcessing}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-xs font-medium disabled:opacity-50"
                                                >
                                                    <Undo2 size={14} /> Terima Pengembalian
                                                </button>
                                            )}
                                            {(loan.status === "returned" ||
                                                loan.status === "rejected") && (
                                                    <span className="text-xs font-semibold text-slate-400 italic">
                                                        Selesai
                                                    </span>
                                                )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                </div>

            </div>

        </div>
    );
}
