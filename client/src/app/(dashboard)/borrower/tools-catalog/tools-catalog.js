"use client";

import { CheckCircle2, Package, PackageSearch, X } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Image from "next/image";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useToolsCatalog } from "@/hooks/borrower/useToolsCatalog";
import HeaderForm from "@/components/Form/HeaderForm";
import Label from "@/components/Form/Label";
import Alert from "@/components/Alert";
import HeaderPage from "@/components/HeaderPage";

export default function CatalogContent() {
    // Catalog Tools Data
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
        today,
        maxDay,
        success,
        page,
        totalItems,
        totalPages,
        showForm,
        updateFilters,
        handleSearch,
        categories
    } = useToolsCatalog();

    let content;

    if (isLoading) {
        content = (
            <div className="flex justify-center p-10 text-slate-500 animate-pulse font-medium">
                Sedang memuat data...
            </div>
        );
    } else if (catalog.length === 0) {
        content = (
            <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
                Belum ada alat yang bisa dipinjam.
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {catalog.map((tool) => (
                    <div
                        key={tool.id}
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                        <div className="flex flex-col flex-1 p-3">
                            <div className="overflow-hidden rounded-xl bg-slate-100 mb-3">
                                <Image
                                    src={`http://localhost:5000${tool.image}`}
                                    alt={tool.name}
                                    width={500}
                                    height={500}
                                    className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    unoptimized
                                />
                            </div>
                            <div className="px-1 space-y-1.5">
                                <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                    {tool.Category?.name || "Tanpa Kategori"}
                                </span>
                                <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                                    {tool.name}
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 p-4 border-t border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Ketersediaan Stok:</span>
                                <span
                                    className={`font-extrabold px-2 py-0.5 rounded-md ${tool.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}
                                >
                                    {tool.stock} unit
                                </span>
                            </div>
                            <button
                                onClick={() => openRequestForm(tool)}
                                disabled={tool.stock < 1}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
                            >
                                {tool.stock > 0 ? "Ajukan Peminjaman" : "Stok Habis"}
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="space-y-6">
                    {/* Header */}
                    <HeaderPage
                        icon={<PackageSearch className="text-emerald-600" size={32} />}
                        title="Katalog Alat"
                    />

                    {/* Alert Messages */}
                    {(error || success) && (
                        <Alert
                            type={error ? "error" : "success"}
                            message={error || success}
                        />
                    )}

                    {/* Filter and Search Data */}
                    <FilterAndSearchData
                        hiddenSearchData={!false}
                        placeHolderName="Cari nama alat..."
                        sort={(e) => updateFilters("sort", e.target.value)}
                        search={(e) => handleSearch(e.target.value)}
                        showBy={(e) => updateFilters("category", e.target.value)}
                        hiddenFilterData={!false}
                        label="Kategori"
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} className="bg-white/20 text-black">
                                {cat.name}
                            </option>
                        ))}
                    </FilterAndSearchData>

                    {/* Main Content */}
                    {content}
                </div>

                <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
            </div>

            {/* Modal Pengajuan Peminjaman */}
            {selectedTool && (
                <Modal
                    isOpen={showForm}
                    onClose={closeRequestForm}
                >
                    {/* Header */}
                    <HeaderForm
                        icon={<Package size={22} className="text-emerald-600" />}
                        title="Pengajuan Peminjaman Alat"
                    />

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input type="hidden" {...register("toolId")} />

                        <div className="overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 max-h-56">
                            <Image
                                src={`http://localhost:5000${selectedTool.image}`}
                                alt={selectedTool.name}
                                width={500}
                                height={500}
                                className="w-full h-56 object-cover rounded-xl"
                                unoptimized
                            />
                        </div>

                        <div>
                            <Label name="Nama Alat" />
                            <input
                                type="text"
                                value={selectedTool.name}
                                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-100 text-slate-600 font-semibold rounded-xl text-sm outline-none"
                                disabled
                            />
                        </div>

                        <div>
                            <Label name="Tenggat Pengembalian" required />
                            <input
                                type="date"
                                {...register("expectedReturnDate")}
                                className={`w-full px-3.5 py-2.5 border text-slate-800 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm cursor-pointer ${errors.expectedReturnDate ? "border-rose-500" : "border-slate-300/80"}`}
                                min={today}
                                max={maxDay}
                                disabled={isSubmitting}
                            />
                            {errors.expectedReturnDate && (
                                <span className="text-rose-500 text-xs mt-1 block">
                                    {errors.expectedReturnDate.message}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
                            >
                                {isSubmitting ? (
                                    "Memproses..."
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} /> Konfirmasi Peminjaman
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={closeRequestForm}
                                className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                                title="Batal"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
