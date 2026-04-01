"use client";

import {
    AlertCircle,
    CheckCircle,
    ClipboardList,
    Undo2,
    XCircle,
} from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useLoanManagement } from "@/hooks/admin/useLoanManagement";
import { Check } from "lucide-react";
import ActionButton from "@/components/ActionButton";
import { ClipboardCheck } from "lucide-react";

export default function LoanManagementPage() {
    // Loan Management Data
    const {
        loans,
        isLoading,
        isProcessing,
        error,
        approveLoan,
        rejectLoan,
        verifying,
        page,
        totalPages,
        totalItems,
        limit,
        updateFilters,
        handleSearch,
        formatDateTime,
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
                    sort={(e) => updateFilters("sort", e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                />

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Table Data Loan Transaction History */}
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        No
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200">
                                        Peminjam
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200">
                                        Spesifikasi Alat
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        Tanggal Pengajuan
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        Proyeksi Pengembalian
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        Status Peminjaman
                                    </th>
                                    <th className="px-6 py-4 border border-slate-200 text-center">
                                        Aksi
                                    </th>
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
                                        const no = index + 1 + (page - 1) * limit;
                                        return (
                                            <tr
                                                key={loan.id}
                                                className="hover:bg-slate-50/80 transition-colors"
                                            >
                                                <td className="text-center">{no}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-800 min-w-40">
                                                        {loan.borrower?.fullName ||
                                                            "Identitas tidak dikenal"}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {loan.borrower?.username}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-800 truncate max-w-sm">
                                                    {loan.Tool?.name || "Nama alat tidak ada."}
                                                </td>
                                                <td className="px-6 py-4 text-center min-w-60">
                                                    {formatDateTime(loan.borrowDate, false)}
                                                </td>
                                                <td className="px-6 py-4 text-center min-w-60">
                                                    {formatDateTime(loan.expectedReturnDate, false)}
                                                </td>
                                                <td className="px-6 py-4 text-center min-w-50">
                                                    <StatusBadge status={loan.status} />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col gap-2">
                                                        <ActionButton
                                                            disabled={loan.status !== "pending" || isProcessing}
                                                            onClick={() => approveLoan(loan.id)}
                                                            name="Setujui"
                                                            color="emerald"
                                                            icon={<CheckCircle size={16} />}
                                                        />

                                                        <ActionButton
                                                            disabled={loan.status !== "pending" || isProcessing}
                                                            onClick={() => rejectLoan(loan.id)}
                                                            name="Tolak"
                                                            color="rose"
                                                            icon={<XCircle size={16} />}
                                                        />

                                                        <ActionButton
                                                            disabled={loan.status !== "verifying" || isProcessing}
                                                            onClick={() => verifying(loan.id)}
                                                            name="Verifikasi"
                                                            color="indigo"
                                                            icon={<ClipboardCheck size={16} />}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
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
