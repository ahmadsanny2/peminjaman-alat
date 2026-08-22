"use client";

import { CheckCircle2, Package, PackageSearch, PackageOpen, X } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Image from "next/image";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useToolsCatalog } from "@/hooks/borrower/useToolsCatalog";
import HeaderForm from "@/components/Form/HeaderForm";
import Label from "@/components/Form/Label";
import Alert from "@/components/Alert";
import HeaderPage from "@/components/HeaderPage";
import { getImageUrl } from "@/lib/image";

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-card-bg rounded-2xl border border-border-subtle shadow-xs h-[320px] animate-pulse">
                        <div className="h-48 bg-app-bg m-3 rounded-xl"></div>
                        <div className="px-4 mt-2 space-y-3">
                            <div className="h-4 w-1/3 bg-app-bg rounded-full"></div>
                            <div className="h-5 w-3/4 bg-app-bg rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    } else if (catalog.length === 0) {
        content = (
            <div className="flex flex-col items-center justify-center p-16 bg-card-bg rounded-2xl border border-border-subtle shadow-xs text-center space-y-4">
                <div className="p-4 bg-app-bg rounded-full text-text-secondary/50 mb-2">
                    <PackageOpen size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Katalog Masih Kosong</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                    Belum ada alat yang tersedia untuk dipinjam saat ini. Silakan periksa kembali nanti.
                </p>
            </div>
        );
    } else {
        content = (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {catalog.map((tool) => (
                    <div
                        key={tool.id}
                        className="bg-card-bg rounded-2xl border border-border-subtle shadow-xs overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                    >
                        <div className="flex flex-col flex-1 p-3">
                            <div className="overflow-hidden rounded-xl bg-app-bg mb-3 flex items-center justify-center min-h-48">
                                {getImageUrl(tool.image) ? (
                                    <Image
                                        src={getImageUrl(tool.image)}
                                        alt={tool.name}
                                        width={500}
                                        height={500}
                                        className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-48 flex flex-col items-center justify-center text-text-secondary/40">
                                        <Package size={36} />
                                        <span className="text-xs mt-1">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="px-1 space-y-1.5">
                                <span className="inline-block text-[11px] font-bold text-text-secondary bg-app-bg border border-border-subtle px-2.5 py-0.5 rounded-full">
                                    {tool.Category?.name || "Tanpa Kategori"}
                                </span>
                                <h3 className="text-sm font-bold text-text-primary leading-snug line-clamp-2">
                                    {tool.name}
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 p-4 border-t border-border-subtle bg-app-bg">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-secondary font-medium">Ketersediaan Stok:</span>
                                <span
                                    className={`font-extrabold px-2 py-0.5 rounded-md ${tool.stock > 0 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 text-rose-700 dark:text-rose-400"}`}
                                >
                                    {tool.stock} unit
                                </span>
                            </div>
                            <button
                                onClick={() => openRequestForm(tool)}
                                disabled={tool.stock < 1}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 disabled:bg-border-subtle disabled:text-text-secondary disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
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
                            <option key={cat.id} className="bg-card-bg text-text-primary">
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

                        <div className="overflow-hidden rounded-xl bg-app-bg border border-border-subtle max-h-56 flex items-center justify-center">
                            {getImageUrl(selectedTool.image) ? (
                                <Image
                                    src={getImageUrl(selectedTool.image)}
                                    alt={selectedTool.name}
                                    width={500}
                                    height={500}
                                    className="w-full h-56 object-cover rounded-xl"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-40 flex flex-col items-center justify-center text-text-secondary/40">
                                    <Package size={36} />
                                    <span className="text-xs mt-1">No Image</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <Label name="Nama Alat" />
                            <input
                                type="text"
                                value={selectedTool.name}
                                className="w-full px-3.5 py-2.5 border border-border-subtle bg-app-bg text-text-primary font-semibold rounded-xl text-sm outline-none disabled:opacity-70"
                                disabled
                            />
                        </div>

                        <div>
                            <Label name="Tenggat Pengembalian" required />
                            <input
                                type="date"
                                {...register("expectedReturnDate")}
                                className={`w-full px-3.5 py-2.5 border bg-card-bg text-text-primary rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm cursor-pointer transition-all ${errors.expectedReturnDate ? "border-rose-500" : "border-border-subtle"}`}
                                min={today}
                                max={maxDay}
                                disabled={isSubmitting}
                            />
                            <p className="text-[11px] text-text-secondary mt-1.5">
                                *Maksimal durasi peminjaman adalah 7 hari.
                            </p>
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
                                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                                className="p-2.5 text-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl border border-border-subtle transition-colors cursor-pointer"
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
