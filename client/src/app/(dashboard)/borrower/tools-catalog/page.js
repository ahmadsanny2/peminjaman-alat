"use client";

import AlertComponent from "@/components/AlertComponent";
import FilterAndSearchData from "@/components/FilterAndSearchDataComponent";
import Modal from "@/components/ModalComponent";
import Pagination from "@/components/PaginationComponent";
import { useBorrower } from "@/hooks/borrower/useBorrower";
import { useFilterAndSearchData } from "@/hooks/useFilterAndSearchData";
import {
    PackageSearch,
    X,
    CheckCircle2,
    Package,
} from "lucide-react";
import Image from "next/image";

export default function CatalogPage() {

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
        handleSearch
    } = useBorrower();

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <PackageSearch className="text-emerald-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Katalog Alat</h1>
                    </div>
                </div>

                {/* Error Response */}
                {error && (
                    <AlertComponent message={error} isSuccess={false} />
                )}

                {/* Success Response */}
                {success && (
                    <AlertComponent message={success} isSuccess={!false} />
                )}

                {/* Filter and Search Data */}
                <FilterAndSearchData
                    hiddenSearchData={!false}
                    placeHolderName="Cari nama alat..."
                    sort={(e) => updateFilters('sort', e.target.value)}
                    search={(e) => handleSearch(e.target.value)}
                />

                {/* Main Content */}
                {/* IsLoading Response */}
                {isLoading ? (
                    <div className="flex justify-center p-10 text-slate-500 animate-pulse font-medium">
                        Sedang memuat data...
                    </div>
                ) : catalog.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
                        Belum ada alat yang bisa dipinjam.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">

                        {catalog.map((tool) => (
                            <div
                                key={tool.id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md gap-5 h-110"
                            >
                                <div className="flex flex-col flex-1 border-b border-slate-100 gap-2">
                                    <div className="">
                                        <Image
                                            src={`http://localhost:5000${tool.image}`}
                                            alt={tool.name}
                                            width={500}
                                            height={500}
                                            className="flex w-full h-52 rounded-lg"
                                            loading="lazy"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="px-5">
                                        <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded mb-3">
                                            {tool.Category?.name || "Tanpa Kategori"}
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 mb-2 leading-tight">
                                            {tool.name.substring(0, 50)}
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
                                </div>

                                {selectedTool?.id === tool.id ? (

                                    <Modal
                                        customClass={showForm ? "fixed inset-0 h-full flex items-center justify-center" : "hidden"}
                                        isOpen={openRequestForm}

                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <Package size={25} className="text-blue-600" />
                                            <h1 className="max-md:text-lg text-xl font-semibold text-slate-800 flex items-center gap-1.5">
                                                Form Pengajuan Peminjaman Alat
                                            </h1>

                                        </div>

                                        {/* Form */}
                                        <form onSubmit={onSubmit} className="space-y-3">
                                            <input type="hidden" {...register("toolId")} />

                                            <Image
                                                src={`http://localhost:5000${tool.image}`}
                                                alt={tool.name}
                                                width={500}
                                                height={500}
                                                className="flex w-full h-72 rounded-lg"
                                                unoptimized
                                            />

                                            <div className="">
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    Nama Alat
                                                </label>
                                                <input type="text" value={tool.name} className="w-full p-2 border disabled:text-slate-400 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm border-slate-300" disabled />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                                    Tenggat Pengembalian
                                                </label>
                                                <input
                                                    type="date"
                                                    {...register("expectedReturnDate")}
                                                    className={`w-full p-2 border text-black rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm cursor-pointer ${errors.expectedReturnDate ? "border-red-500" : "border-slate-300"}`}
                                                    min={today}
                                                    max={maxDay}
                                                    disabled={isSubmitting}
                                                />
                                                {errors.expectedReturnDate && (
                                                    <span className="text-red-500 text-[10px] mt-1 block leading-tight">
                                                        {errors.expectedReturnDate.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                                                >
                                                    {isSubmitting ? (
                                                        "Memproses..."
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 size={16} /> Konfirmasi
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={closeRequestForm}
                                                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer p-2 rounded"
                                                    title="Batal"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                        </form>
                                    </Modal>

                                ) : ""}
                                <div className="p-4 bg-slate-50">
                                    <button
                                        onClick={() => openRequestForm(tool)}
                                        disabled={tool.stock < 1}
                                        className="w-full py-2 rounded text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-default bg-white text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                                    >
                                        {tool.stock > 0 ? "Ajukan Peminjaman" : "Stok Habis"}
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>

            <Pagination page={page} totalData={totalItems} totalPages={totalPages} />
        </div>
    );
}
