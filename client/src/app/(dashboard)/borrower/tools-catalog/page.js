"use client";

import { useBorrower } from "@/hooks/borrower/useBorrower";
import {
    PackageSearch,
    CalendarClock,
    X,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function CatalogPage() {
    const {
        catalog,
        isLoading,
        isSubmitting,
        error,
        selectedTool,
        register,
        errors,
        onSubmit,
        openRequestForm,
        closeRequestForm,
    } = useBorrower();

    let contentCatalog = ""

    if (isLoading) {
        contentCatalog = (
            <div className="flex justify-center p-10 text-slate-500 animate-pulse font-medium">
                Mensinkronisasi katalog inventaris dengan peladen...
            </div>
        )
    } else if (catalog.length === 0) {
        contentCatalog = (
            <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
                Katalog kosong. Belum ada spesifikasi alat yang diregistrasikan oleh
                administrator.
            </div>
        )
    } else {
        contentCatalog = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalog.map((tool) => (
                    <div
                        key={tool.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                    >
                        <div className="p-5 flex-1 border-b border-slate-100">
                            <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded mb-3">
                                {tool.Category?.name || "Tanpa Kategori"}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
                                {tool.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-4 text-sm">
                                <span className="text-slate-500">Stok:</span>
                                <span
                                    className={`font-bold ${tool.stock > 0 ? "text-emerald-600" : "text-red-500"}`}
                                >
                                    {tool.stock} unit
                                </span>
                            </div>
                        </div>

                        {selectedTool?.id === tool.id ? (
                            <div className="p-5 bg-slate-50 border-t border-blue-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                        <CalendarClock size={16} className="text-blue-600" /> Form
                                        Pengajuan
                                    </h4>
                                    <button
                                        onClick={closeRequestForm}
                                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                        title="Batal"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <form onSubmit={onSubmit} className="space-y-3">
                                    <input type="hidden" {...register("toolId")} />

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Tenggat Pengembalian
                                        </label>
                                        <input
                                            type="date"
                                            {...register("expectedReturnDate")}
                                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm ${errors.expectedReturnDate ? "border-red-500" : "border-slate-300"}`}
                                            disabled={isSubmitting}
                                        />
                                        {errors.expectedReturnDate && (
                                            <span className="text-red-500 text-[10px] mt-1 block leading-tight">
                                                {errors.expectedReturnDate.message}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            "Memproses..."
                                        ) : (
                                            <>
                                                <CheckCircle2 size={16} /> Konfirmasi
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50">
                                <button
                                    onClick={() => openRequestForm(tool)}
                                    disabled={tool.stock < 1}
                                    className="w-full py-2 rounded text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-default bg-white text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                                >
                                    {tool.stock > 0 ? "Ajukan Peminjaman" : "Stok Habis"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <PackageSearch className="text-emerald-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold">Katalog Alat</h1>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3">
                    <AlertCircle className="mt-0.5 text-red-500" size={18} />
                    <span>{error}</span>
                </div>
            )}

            {contentCatalog}
        </div>
    );
}
