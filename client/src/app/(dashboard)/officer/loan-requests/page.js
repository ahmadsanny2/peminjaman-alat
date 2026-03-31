"use client";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useLoanManagement } from "@/hooks/admin/useLoanManagement";
import { ClipboardCheck, CheckCircle, Undo2, AlertCircle, XCircle } from "lucide-react";

export default function PetugasValidasiPage() {

    // Loan Management Data
    const { loans, isLoading, isProcessing, error, approveLoan, returnLoan, rejectLoan, page, totalItems, totalPages, updateFilters, handleSearch } =
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

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
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

                {/* Filter and Search Data */}
                <FilterAndSearchData
                    hiddenSearchData={!false}
                    placeHolderName="Cari nama alat..."
                    sort={(e) => updateFilters('sort', e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                />

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                        {/* Loan Request History Data */}
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Peminjam</th>
                                    <th className="px-6 py-4">Alat</th>
                                    <th className="px-6 py-4 text-center">Tanggal Diajukan</th>
                                    <th className="px-6 py-4 text-center">Tenggat Pengembalian</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-slate-500 animate-pulse"
                                        >
                                            Sedang mengambil data riwayat daftar peminjaman alat...
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
                                            <td className="px-6 py-4 text-center">{formatDate(loan.borrowDate)}</td>
                                            <td className="px-6 py-4 text-center">
                                                {formatDate(loan.expectedReturnDate)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={loan.status} />
                                            </td>
                                            <td className="px-6 py-4 text-center">
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

            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}
