"use client";

import StatusBadge from "@/components/StatusBadge";
import { useBorrower } from "@/hooks/borrower/useBorrower";
import { History, AlertCircle } from "lucide-react";

export default function RiwayatPeminjamanPage() {

    // Borrower Data
    const { myLoans, isLoading, error } = useBorrower();

    // Format Date
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
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
                                            {loan.Tool?.name || "Referensi Instrumen Hilang"}
                                        </td>
                                        <td className="px-6 py-4 text-center">{formatDate(loan.borrowDate)}</td>
                                        <td className="px-6 py-4 text-center">
                                            {formatDate(loan.expectedReturnDate)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {loan.actualReturnDate
                                                ? formatDate(loan.actualReturnDate)
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
    );
}
