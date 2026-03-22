"use client";

import FilterAndSearchData from "@/components/FilterAndSearchDataComponent";
import Pagination from "@/components/PaginationComponent";
import StatusBadge from "@/components/StatusBadge";
import { useMyLoans } from "@/hooks/borrower/useMyLoans";
import { History, AlertCircle } from "lucide-react";

export default function LoanTransactionHistoryPage() {
    // Borrower Data
    const {
        myLoans,
        isLoading,
        error,
        totalItems,
        page,
        totalPages,
        updateFilters,
        handleSearch,
        formatDateTime,
    } = useMyLoans();

    // Format Date
    // const formatDateTime = (dateString) => {
    //     if (!dateString) return "-";
    //     return new Date(dateString).toLocaleDateString("id-ID", {
    //         day: "numeric",
    //         month: "long",
    //         year: "numeric",
    //     });
    // };

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <History className="text-purple-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
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
                    placeHolderName="Cari nama alat pinjaman..."
                    sort={(e) => updateFilters("sort", e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                    hiddenFilterData={true}
                    label="Status"
                    showBy={(e) => updateFilters("status", e.target.value)}
                >
                    <option value="pending" className="bg-white/20 text-black">
                        Menunggu Persetujuan
                    </option>
                    <option value="approved" className="bg-white/20 text-black">
                        Sedang Dipinjam
                    </option>
                    <option value="rejected" className="bg-white/20 text-black">
                        Pengajuan Ditolak
                    </option>
                    <option value="returned" className="bg-white/20 text-black">
                        Telah Dikembalikan
                    </option>
                </FilterAndSearchData>

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Table Data Transaction History */}
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr className="text-center">
                                    <th className="px-6 py-4 text-left">Nama Alat</th>
                                    <th className="px-6 py-4">Tanggal Pengajuan</th>
                                    <th className="px-6 py-4">Tenggat Pengembalian</th>
                                    <th className="px-6 py-4">Tanggal Dikembalikan</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-slate-500 animate-pulse"
                                        >
                                            Data riwayat transaksi peminjaman sedang loading.
                                        </td>
                                    </tr>
                                ) : myLoans.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-slate-500"
                                        >
                                            Data riwayat transaksi peminjaman belum ada.
                                        </td>
                                    </tr>
                                ) : (
                                    myLoans.map((loan) => (
                                        <tr
                                            key={loan.id}
                                            className="hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                {loan.Tool?.name || "Nama alat tidak ada."}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {formatDateTime(loan.borrowDate, false)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {formatDateTime(loan.expectedReturnDate, false)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {loan.actualReturnDate
                                                    ? formatDateTime(loan.actualReturnDate, false)
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={loan.status} />
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
