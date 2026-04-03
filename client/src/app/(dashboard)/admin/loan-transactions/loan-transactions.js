"use client";

import {
    AlertCircle,
    CheckCircle,
    ClipboardList,
    XCircle,
    ClipboardCheck,
} from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useLoanManagement } from "@/hooks/admin/useLoanManagement";
import ActionButton from "@/components/ActionButton";
import TableCell from "@/components/Table/TableCell";
import ProofImageReturnLoan from "@/components/Modals/ProofImageReturnLoan";

export default function LoanManagementContent() {
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
        openProofImage,
        selectedLoan,
        showProofModal,
        closeProofModal,
    } = useLoanManagement();

    const tableTH = [
        {
            name: "No",
            className: "w-20 text-center",
        },
        {
            name: "Peminjam",
            className: "min-w-60 text-center",
        },
        {
            name: "Nama Alat",
            className: "min-w-80 text-left",
        },
        {
            name: "Tanggal Pengajuan",
            className: "min-w-50 text-center",
        },
        {
            name: "Proyeksi Pengembalian",
            className: "min-w-50 text-center",
        },
        {
            name: "Status Peminjaman",
            className: "min-w-50 text-center",
        },
        {
            name: "Bukti",
            className: "min-w-30 text-center",
        },
        {
            name: "Aksi",
            className: "w-30 text-center",
        },
    ];

    let content;

    if (isLoading) {
        content = (
            <tr>
                <TableCell colspan="8" className="text-center">
                    Sedang mengambil data...
                </TableCell>
            </tr>
        );
    } else if (loans.length === 0) {
        content = (
            <tr>
                <TableCell colspan="8" className="text-center">
                    Belum ada riwayat peminjaman alat.
                </TableCell>
            </tr>
        );
    } else {
        content = loans.map((loan, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* No */}
                    <TableCell className="text-center">{no}</TableCell>

                    {/* Borrower Name */}
                    <TableCell className="text-center">
                        <div className="font-semibold">
                            {loan.borrower?.fullName || "Identitas tidak dikenal"}
                        </div>
                        <div className="">@{loan.borrower?.username}</div>
                    </TableCell>

                    {/* Name Tool */}
                    <TableCell className="">
                        {loan.Tool?.name || "Nama alat tidak ada."}
                    </TableCell>

                    {/* Borrow Date */}
                    <TableCell className="text-center">
                        {formatDateTime(loan.borrowDate, false)}
                    </TableCell>

                    {/* Expected Return Date */}
                    <TableCell className="text-center">
                        {formatDateTime(loan.expectedReturnDate, false)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                        <StatusBadge status={loan.status} />
                    </TableCell>

                    {/* Proof Image */}
                    <TableCell className="text-center">
                        <button
                            onClick={() => openProofImage(loan)}
                            disabled={!loan.image}
                            className={`text-xs font-medium transition-colors ${loan.image
                                ? "text-blue-600 hover:text-blue-800 cursor-pointer underline underline-offset-2"
                                : "text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            Lihat Bukti
                        </button>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center">
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
                    </TableCell>
                </tr>
            );
        });
    }

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
                                    {tableTH.map((th, index) => (
                                        <TableCell
                                            key={index}
                                            isHeader={true}
                                            className={th.className}
                                        >
                                            {th.name}
                                        </TableCell>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">{content}</tbody>
                        </table>

                        {selectedLoan && (
                            <ProofImageReturnLoan
                                closeProofModal={closeProofModal}
                                selectedLoan={selectedLoan}
                                showProofModal={showProofModal}
                            />
                        )}
                    </div>
                </div>
            </div>

            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}
