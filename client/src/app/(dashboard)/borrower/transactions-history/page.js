"use client";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import { useMyLoans } from "@/hooks/borrower/useMyLoans";
import { CheckCircle2, X, Package, Undo2, History, AlertCircle, XCircle } from "lucide-react";
import Image from "next/image";

export default function LoanTransactionHistoryPage() {
    // Mengekstraksi seluruh logika operasional dari Custom Hook
    const {
        page,
        updateFilters,
        handleSearch,
        myLoans,
        isLoading,
        error,
        totalItems,
        totalPages,
        formatDateTime,
        cancelLoan,
        isProcessing,
        showForm,
        setShowForm,
        openRetunLoanForm,
        handleChange,
        selectedLoan,
        handleSubmit, // Diekspor agar bisa dipanggil oleh <form onSubmit={handleSubmit}> di UI
        openProofImage,
        closeProofModal,
        showProofModal,
        calculateFine
    } = useMyLoans();

    // Fungsi utilitas untuk menutup form dan membersihkan state
    const closeReturnForm = () => {
        setShowForm(false);
    };

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
                    hiddenSearchData={false}
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
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <tr className="text-center">
                                    <th className="px-6 py-4 text-left">Nama Alat</th>
                                    <th className="px-6 py-4">Tanggal Pengajuan</th>
                                    <th className="px-6 py-4">Tenggat Pengembalian</th>
                                    <th className="px-6 py-4">Tanggal Dikembalikan</th>
                                    <th className="px-6 py-4">Denda</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Bukti</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-slate-500 animate-pulse">
                                            Data riwayat transaksi peminjaman sedang memuat...
                                        </td>
                                    </tr>
                                ) : !isLoading && myLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                                            Data riwayat transaksi peminjaman belum ada.
                                        </td>
                                    </tr>
                                ) : (
                                    myLoans.map((loan) => (
                                        <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-left">
                                                {loan.Tool?.name || "Nama alat tidak ada."}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {formatDateTime(loan.borrowDate, false)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {formatDateTime(loan.expectedReturnDate, false)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {loan.actualReturnDate ? formatDateTime(loan.actualReturnDate, false) : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {calculateFine(loan.expectedReturnDate, loan.actualReturnDate)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={loan.status} />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    // Kirim SELURUH objek loan, bukan cuma loan.id
                                                    onClick={() => openProofImage(loan)}
                                                    disabled={!loan.image}
                                                    className={`text-xs font-medium transition-colors ${loan.image
                                                        ? "text-blue-600 hover:text-blue-800 cursor-pointer underline underline-offset-2"
                                                        : "text-slate-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Lihat Bukti
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2 min-w-30">
                                                {loan.status === "pending" && (
                                                    <button
                                                        onClick={() => cancelLoan(loan.id)}
                                                        disabled={isProcessing}
                                                        className="text-red-600 rounded transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer disabled:cursor-default"
                                                        title="Batalkan Pengajuan"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}

                                                {loan.status === "approved" && (
                                                    <button
                                                        onClick={() => openRetunLoanForm(loan)}
                                                        disabled={isProcessing}
                                                        className="text-yellow-600 transition-colors text-xs font-medium disabled:opacity-50 cursor-pointer disabled:cursor-default"
                                                        title="Kembalikan Alat"
                                                    >
                                                        <Undo2 size={18} />
                                                    </button>
                                                )}

                                                {["returned", "rejected", "canceled"].includes(loan.status) && (
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

                {/* MODAL PENGEMBALIAN */}
                {selectedLoan && (
                    <Modal
                        customClass={showForm ? "fixed inset-0 h-full flex items-center justify-center z-50 bg-black/50" : "hidden"}
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
                                    {isProcessing ? "Memproses..." : <><CheckCircle2 size={16} /> Kirim Bukti</>}
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

                {/* MODAL PRATINJAU BUKTI GAMBAR - DITARUH DI LUAR TABEL */}
                {selectedLoan && (
                    <Modal
                        // Pastikan lo udah bikin state showProofModal di useMyLoans.js
                        customClass={showProofModal ? "fixed inset-0 h-full flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm" : "hidden"}
                        isOpen={showProofModal}
                        onClose={closeProofModal}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4 border-b pb-3">
                            <Package size={24} className="text-blue-600" />
                            <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-1.5">
                                Dokumentasi Pengembalian Alat
                            </h1>
                        </div>

                        {/* Konten Display (Bukan Form) */}
                        <div className="space-y-4">

                            {/* Kontainer Gambar */}
                            <div className="relative w-full h-64 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                                {selectedLoan.image ? (
                                    <Image
                                        // Hapus slash ganda jika ada dari database
                                        src={`http://localhost:5000/${selectedLoan.image.replace(/^\//, '')}`}
                                        alt={selectedLoan.Tool?.name || "Bukti"}
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                    />
                                ) : (
                                    <span className="text-sm text-slate-400 font-medium">Visual tidak tersedia</span>
                                )}
                            </div>

                            {/* Info Nama Alat */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Instrumen Terkait
                                </label>
                                <input
                                    type="text"
                                    // Ambil nama dari relasi Tool
                                    value={selectedLoan.Tool?.name || "Instrumen tidak diketahui"}
                                    className="w-full p-2.5 border bg-slate-50 text-slate-600 font-medium rounded-lg outline-none text-sm border-slate-300"
                                    disabled
                                />
                            </div>

                            {/* Tombol Tutup */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={closeProofModal}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm rounded-lg transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}