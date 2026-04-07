"use client";

import ActionButton from "@/components/ActionButton";
import Alert from "@/components/Alert";
import FilterAndSearchData from "@/components/FilterAndSearchData";
import HeaderPage from "@/components/HeaderPage";
import ConfirmationModal from "@/components/Modals/Confirmation";
import ProofImageReturnLoan from "@/components/Modals/ProofImageReturnLoan";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import TableCell from "@/components/Table/TableCell";
import calculateFine from "@/constants/calculateFine";
import { useLoanManagement } from "@/hooks/officer/useLoanManagement";
import {
    ClipboardCheck,
    CheckCircle,
    AlertCircle,
    XCircle,
} from "lucide-react";

export default function LoanRequestsContent() {
    // Loan Management Data
    const {
        loans,
        isLoading,
        isProcessing,
        error,
        success,
        approveLoan,
        rejectLoan,
        page,
        totalPages,
        totalItems,
        limit,
        updateFilters,
        handleSearch,
        formatDateTime,
        verifying,
        openProofImage,
        selectedLoan,
        showProofModal,
        closeProofModal,
        confirmState, ask, close
    } = useLoanManagement();

    const tableTH = [
        {
            name: "No",
            className: "w-20 text-center",
        },
        {
            name: "Peminjam",
            className: "min-w-70 text-center",
        },
        {
            name: "Nama Alat",
            className: "min-w-75 text-left",
        },
        {
            name: "Tanggal Diajukan",
            className: "min-w-50 text-center",
        },
        {
            name: "Tenggat Pengembalian",
            className: "min-w-50 text-center",
        },
        {
            name: "Tanggal Dikembalikan",
            className: "min-w-50 text-center",
        },
        {
            name: "Denda",
            className: "min-w-30 text-center",
        },
        {
            name: "Status",
            className: "min-w-50 text-center",
        },
        {
            name: "Bukti",
            className: "min-w-50 text-center",
        },
        {
            name: "Aksi",
            className: "min-w-50 text-center",
        },
    ];

    let content;

    if (isLoading) {
        content = (
            <tr>
                <TableCell colspan="10" className="text-center">
                    Sedang mengambil data...
                </TableCell>
            </tr>
        );
    } else if (loans.length === 0) {
        content = (
            <tr>
                <TableCell colspan="10" className="text-center">
                    Tidak ada data peminjaman alat.
                </TableCell>
            </tr>
        );
    } else {
        content = loans.map((loan, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Number */}
                    <TableCell className="w-20 text-center">{no}</TableCell>

                    {/* Borrower Name */}
                    <TableCell className="min-w-70 text-center">
                        {loan.borrower?.fullName || "Identitas tidak dikenal."}
                    </TableCell>

                    {/* Tool Name */}
                    <TableCell className="min-w-75 text-left">
                        {loan.Tool?.name}
                    </TableCell>

                    {/* Borrow Date */}
                    <TableCell className="min-w-50 text-center">
                        {formatDateTime(loan.borrowDate, false)}
                    </TableCell>

                    {/* Expected Return Date */}
                    <TableCell className="min-w-50 text-center">
                        {formatDateTime(loan.expectedReturnDate, false)}
                    </TableCell>

                    {/* Actual Return Date */}
                    <TableCell className="min-w-50 text-center">
                        {formatDateTime(loan.actualReturnDate, false)}
                    </TableCell>

                    {/* Fine */}
                    <TableCell className="min-w-30 text-center">
                        {calculateFine(loan.expectedReturnDate, loan.actualReturnDate)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="min-w-50 text-center">
                        <StatusBadge status={loan.status} />
                    </TableCell>

                    {/* Open Proof Image */}
                    <TableCell className="min-w-50 text-center">
                        <ActionButton
                            name="Lihat Bukti"
                            onClick={() => openProofImage(loan)}
                            disabled={!loan.image}
                            className={`text-xs font-medium transition-colors ${loan.image
                                ? "text-blue-600 hover:text-blue-800 cursor-pointer underline underline-offset-2"
                                : "text-slate-400 cursor-not-allowed"
                                }`}
                        />
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="px-6 py-4 text-center">
                        <div className="flex flex-col w-full gap-2">
                            <ActionButton
                                disabled={loan.status !== "pending" || isProcessing}
                                onClick={() => ask({
                                    title: "Setujui Pinjaman",
                                    message: "Yakin ingin menyetujui pengajuan peminjaman ini?",
                                    color: "emerald",
                                    action: () => approveLoan(loan.id)
                                })}
                                name="Setujui"
                                color="emerald"
                                icon={<CheckCircle size={16} />}
                            />

                            <ActionButton
                                disabled={loan.status !== "pending" || isProcessing}
                                onClick={() => ask({
                                    title: "Tolak Pinjaman",
                                    message: "Yakin ingin tolak pengajuan peminjaman ini?",
                                    color: "rose",
                                    action: () => rejectLoan(loan.id)
                                })}
                                name="Tolak"
                                color="rose"
                                icon={<XCircle size={16} />}
                            />

                            <ActionButton
                                disabled={loan.status !== "verifying" || isProcessing}
                                onClick={() => ask({
                                    title: "Verifikasi Pengembalian",
                                    message: "Yakin ingin verifikasi pengembalian peminjaman ini?",
                                    color: "indigo",
                                    action: () => verifying(loan.id)
                                })}
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
                <HeaderPage
                    icon={<ClipboardCheck className="text-emerald-600" size={32} />}
                    title="Daftar Peminjaman"
                />

                {/* Alert Message */}
                {(error || success) && (
                    <Alert
                        type={error ? "error" : "success"}
                        message={error || success}
                    />
                )}

                {/* Filter and Search Data */}
                <FilterAndSearchData
                    hiddenSearchData={!false}
                    placeHolderName="Cari nama peminjam..."
                    sort={(e) => updateFilters("sort", e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                />

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {/* Loan Request History Data */}
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr>
                                    {tableTH.map((th, index) => (
                                        <TableCell key={index} className={th.className}>
                                            {th.name}
                                        </TableCell>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">{content}</tbody>
                        </table>

                        {/* Proof Image Return Loan */}
                        {selectedLoan && (
                            <ProofImageReturnLoan
                                closeProofModal={closeProofModal}
                                selectedLoan={selectedLoan}
                                showProofModal={showProofModal}
                            />
                        )}

                        <ConfirmationModal
                            isOpen={confirmState.isOpen}
                            title={confirmState.title}
                            message={confirmState.message}
                            color={confirmState.color}
                            confirmText={confirmState.confirmText}
                            onConfirm={confirmState.onConfirm}
                            onCancel={close}
                        />
                    </div>
                </div>
            </div>

            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}
