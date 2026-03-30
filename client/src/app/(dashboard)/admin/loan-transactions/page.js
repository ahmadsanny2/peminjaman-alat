"use client";

import { AlertCircle, CheckCircle, ClipboardList, Undo2, XCircle } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useLoanManagement } from "@/hooks/admin/useLoanManagement";

export default function LoanManagementPage() {

    // Loan Management Data
    const {
        loans,
        isLoading,
        isProcessing,
        error,
        approveLoan,
        rejectLoan,
        returnLoan,
        page,
        totalPages,
        totalItems,
        limit,
        updateFilters,
        handleSearch,
        formatDateTime
    } = useLoanManagement();

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <ClipboardList className="text-yellow-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Transaksi Peminjaman</h1>
                    </div>
                </div>

                {/* Error Response */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3">
                        <AlertCircle className="mt-0.5 text-red-500" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <FilterAndSearchData
                    hiddenSearchData={!false}
                    placeHolderName="Cari nama peminjam..."
                    sort={(e) => updateFilters('sort', e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                />

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">

                        {/* Table Data Loan Transaction History */}
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border border-slate-200 text-center">No</th>
                                    <th className="px-6 py-4 border border-slate-200">Peminjam</th>
                                    <th className="px-6 py-4 border border-slate-200">Spesifikasi Alat</th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">Tanggal Pengajuan</th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">Proyeksi Pengembalian</th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">Status Peminjaman</th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-slate-500 animate-pulse"
                                        >
                                            Sedang mengambil data riwayat peminjaman alat...
                                        </td>
                                    </tr>
                                ) : loans.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-slate-500"
                                        >
                                            Belum ada riwayat peminjaman alat.
                                        </td>
                                    </tr>
                                ) : (
                                    loans.map((loan, index) => {
                                        const no = index + 1 + (page - 1) * limit
                                        return (
                                            <tr
                                                key={loan.id}
                                                className="hover:bg-slate-50/80 transition-colors"
                                            >
                                                <td className="text-center">{no}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-800 min-w-40">
                                                        {loan.borrower?.fullName || "Identitas tidak dikenal"}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {loan.borrower?.username}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-800 truncate max-w-sm">
                                                    {loan.Tool?.name || "Nama alat tidak ada."}
                                                </td>
                                                <td className="px-6 py-4 text-center min-w-60">{formatDateTime(loan.borrowDate, false)}</td>
                                                <td className="px-6 py-4 text-center min-w-60">
                                                    {formatDateTime(loan.expectedReturnDate, false)}
                                                </td>
                                                <td className="px-6 py-4 text-center min-w-50">
                                                    <StatusBadge status={loan.status} />
                                                </td>
                                                <td className="px-6 py-4 text-center space-x-2 min-w-30">
                                                    {loan.status === "pending" && (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => approveLoan(loan.id)}
                                                                disabled={isProcessing}
                                                                className="text-emerald-600 rounded transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer disabled:cursor-default"
                                                                title="Setujui"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </button>

                                                            <button
                                                                onClick={() => rejectLoan(loan.id)}
                                                                disabled={isProcessing}
                                                                className="text-red-600 rounded transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer disabled:cursor-default"
                                                                title="Tolak"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {loan.status === "approved" && (
                                                        <button
                                                            onClick={() => returnLoan(loan.id)}
                                                            disabled={isProcessing}
                                                            className="text-yellow-600 transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer disabled:cursor-default"
                                                        >
                                                            <Undo2 size={14} />
                                                        </button>
                                                    )}

                                                    {(loan.status === "returned" || loan.status === "rejected" || loan.status === "canceled") && (
                                                        <span className="text-xs font-semibold text-slate-400 italic">
                                                            Selesai
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}
