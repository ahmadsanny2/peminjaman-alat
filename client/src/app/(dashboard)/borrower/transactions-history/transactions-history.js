"use client";

import ActionButton from "@/components/ActionButton";
import Alert from "@/components/Alert";
import FilterAndSearchData from "@/components/FilterAndSearchData";
import Option from "@/components/Form/Option";
import HeaderPage from "@/components/HeaderPage";
import Modal from "@/components/Modal";
import ProofImageReturnLoan from "@/components/Modals/ProofImageReturnLoan";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import TableCell from "@/components/Table/TableCell";
import calculateFine from "@/constants/calculateFine";
import { useMyLoans } from "@/hooks/borrower/useMyLoans";
import {
    CheckCircle2,
    X,
    Package,
    Undo2,
    History,
    XCircle,
} from "lucide-react";

export default function LoanTransactionHistoryContent() {
    const {
        page,
        updateFilters,
        handleSearch,
        myLoans,
        isLoading,
        error,
        success,
        totalItems,
        totalPages,
        formatDateTime,
        cancelLoan,
        isProcessing,
        showForm,
        openRetunLoanForm,
        handleChange,
        selectedLoan,
        handleSubmit,
        openProofImage,
        closeProofModal,
        showProofModal,
        closeReturnForm,
        limit,
    } = useMyLoans();

    const tableTH = [
        {
            name: "No",
            className: "text-center",
        },
        {
            name: "Nama Alat",
            className: "text-left",
        },
        {
            name: "Tanggal Pengajuan",
            className: "text-center",
        },
        {
            name: "Tenggat Pengembalian",
            className: "text-center",
        },
        {
            name: "Tanggal Dikembalikan",
            className: "text-center",
        },
        {
            name: "Denda",
            className: "text-center",
        },
        {
            name: "Status",
            className: "text-center",
        },
        {
            name: "Bukti",
            className: "text-center",
        },
        {
            name: "Aksi",
            className: "text-center",
        },
    ];

    let content;

    if (isLoading) {
        content = (
            <tr>
                <TableCell colspan="8" className="text-center">
                    Data riwayat transaksi peminjaman sedang memuat...
                </TableCell>
            </tr>
        );
    } else if (myLoans.length === 0) {
        content = (
            <tr>
                <TableCell colspan="8" className="text-center">
                    Data riwayat transaksi peminjaman belum ada.
                </TableCell>
            </tr>
        );
    } else {
        content = myLoans.map((loan, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">

                    {/* Number */}
                    <TableCell className="text-center">{no}</TableCell>

                    {/* Tool Name */}
                    <TableCell className="text-left">
                        {loan.Tool?.name || "Nama alat tidak ada."}
                    </TableCell>

                    {/* Borrow Date */}
                    <TableCell className="text-center min-w-fit">
                        {formatDateTime(loan.borrowDate, false)}
                    </TableCell>

                    {/* Expected Return Date */}
                    <TableCell className="text-center">
                        {formatDateTime(loan.expectedReturnDate, false)}
                    </TableCell>

                    {/* Actual Return Date */}
                    <TableCell className="text-center">
                        {loan.actualReturnDate
                            ? formatDateTime(loan.actualReturnDate, false)
                            : "-"}
                    </TableCell>

                    {/* Fine */}
                    <TableCell className="text-center">
                        {calculateFine(loan.expectedReturnDate, loan.actualReturnDate)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
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
                    <TableCell className="text-center min-w-30">
                        <div className="flex flex-col w-full gap-2">
                            <ActionButton
                                disabled={loan.status !== "approved" || isProcessing}
                                onClick={() => openRetunLoanForm(loan)}
                                name="Kembalikan"
                                color="amber"
                                icon={<Undo2 size={16} />}
                            />

                            <ActionButton
                                disabled={loan.status !== "pending" || isProcessing}
                                onClick={() => cancelLoan(loan.id)}
                                name="Batalkan"
                                color="slate"
                                icon={<XCircle size={16} />}
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
                    icon={<History className="text-purple-600" size={32} />}
                    title="Riwayat Transaksi"
                />

                {/* Alert Message */}
                {(error || success) && (
                    <Alert type={error ? "error" : "success"} message={error || success} />
                )}

                {/* Filter and Search Data */}
                <FilterAndSearchData
                    hiddenSearchData={false}
                    placeHolderName="Cari nama alat pinjaman..."
                    sort={(e) => updateFilters("sort", e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                    hiddenFilterData={true}
                    label="Status"
                    showBy={(e) => updateFilters("status", e.target.value)}
                >
                    <Option optionName="Menunggu Persetujuan" optionValue="pending" />
                    <Option optionName="Dipinjam" optionValue="approved" />
                    <Option optionName="Ditolak" optionValue="rejected" />
                    <Option optionName="Dikembalikan" optionValue="returned" />
                    <Option optionName="Dibatalkan" optionValue="canceled" />
                </FilterAndSearchData>

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr className="">
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
                    </div>
                </div>

                {/* Return Loan Modal */}
                {selectedLoan && (
                    <Modal
                        customClass={
                            showForm
                                ? "fixed inset-0 h-full flex items-center justify-center z-50 bg-black/50"
                                : "hidden"
                        }
                        isOpen={showForm}
                        onClose={closeReturnForm}
                    >
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <Package size={25} className="text-blue-600" />
                            <h1 className="max-md:text-lg text-xl font-semibold text-slate-800 flex items-center gap-1.5">
                                Form Pengembalian Alat
                            </h1>
                        </div>

                        {/* Menggunakan handleSubmit dari hook */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="hidden" value={selectedLoan.id} />

                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Nama Alat
                                </label>
                                <input
                                    type="text"
                                    value={selectedLoan.Tool?.name || "Instrumen tidak diketahui"}
                                    className="w-full p-2.5 border bg-slate-50 text-slate-500 rounded-lg outline-none text-sm border-slate-300"
                                    disabled
                                />
                            </div>

                            {/* Input Tanggal Dikembalikan */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Tanggal Dikembalikan (Aktual)
                                </label>
                                <input
                                    type="date"
                                    name="actualReturnDate" // Pastikan name sesuai dengan yg diekstrak di handleChange
                                    onChange={handleChange}
                                    className="w-full p-2 border text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm border-slate-300 bg-white"
                                    disabled={isProcessing}
                                    required
                                />
                            </div>

                            {/* Input File Gambar */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Unggah Bukti Pengembalian (Wajib)
                                </label>
                                <input
                                    type="file"
                                    name="image" // Pastikan name="image"
                                    accept="image/*"
                                    onChange={handleChange} // Menggunakan handleChange dari hook
                                    className="w-full p-2 border text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm border-slate-300 bg-white"
                                    disabled={isProcessing}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={isProcessing} // Menggunakan isProcessing
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white p-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                                >
                                    {isProcessing ? (
                                        "Memproses..."
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} /> Kirim Bukti
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeReturnForm}
                                    className="text-slate-500 bg-slate-100 hover:text-slate-700 hover:bg-slate-200 cursor-pointer p-2.5 rounded-lg transition-colors"
                                    title="Batal"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Proof Image Return Loan */}
                {selectedLoan && (
                    <ProofImageReturnLoan
                        closeProofModal={closeProofModal}
                        selectedLoan={selectedLoan}
                        showProofModal={showProofModal}
                    />
                )}
            </div>
            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}
