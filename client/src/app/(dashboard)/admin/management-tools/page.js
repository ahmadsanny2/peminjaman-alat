"use client";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useTool } from "@/hooks/admin/useToolManagement";
import {
    Edit,
    Trash2,
    Plus,
    X,
    PackageSearch,
    Layers,
    Edit2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ToolManagementPage() {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;

    // Tools Management Data
    const {
        tools,
        categories,
        formData,
        isEditing,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        totalPages,
        setSort,
        setSearch,
        handleShowForm,
        showForm,
        setShowToolByCategory,
        totalItems
    } = useTool(page, 10);

    return (
        <div className="flex flex-col justify-between h-full space-y-6">

            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <PackageSearch className="text-red-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Alat</h1>
                    </div>
                </div>

                {/* Error Response */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                {/* Content */}
                <div className="space-y-6">

                    {/* Filter and Search Category */}
                    <FilterAndSearchData search={(e) => setSearch(e.target.value)} sort={(e) => setSort(e.target.value)} isShowForm={handleShowForm} showByCategory={(e) => setShowToolByCategory(e.target.value)} placeHolderName="Cari nama alat..." isCategory={true} />

                    {/* Form */}
                    <Modal customClass={showForm ? 'fixed inset-0 flex items-center justify-center z-50' : 'hidden'} isOpen={handleShowForm} onClose={handleShowForm}>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Edit size={18} /> Ubah Alat
                                </>
                            ) : (
                                <>
                                    <Plus size={18} /> Tambah Alat
                                </>
                            )}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
                                <div className="col-span-2 lg:lg:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nama Alat
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full text-gray-900 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm border-slate-300"
                                        placeholder="Masukan Nama Alat"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full text-gray-900 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm border-slate-300"
                                        placeholder="Masukkan Deskripsi Alat"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="max-lg:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kategori
                                    </label>
                                    <div className="relative">
                                        <Layers
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            className="w-full pl-9 p-2.5 border rounded-lg text-sm text-slate-700"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {error.categoryId && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.categoryId.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Stok
                                    </label>
                                    <input
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        min={0}
                                        onChange={handleChange}
                                        className="w-full text-gray-900 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm resize-none"
                                        placeholder="0"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Gambar Alat
                                    </label>
                                    <input
                                        name="image"
                                        type="file"
                                        onChange={handleChange}
                                        className="w-full text-gray-900 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm resize-none"
                                        placeholder="0"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {isEditing ? "Simpan" : "Tambah"}
                                </button>

                                {(isEditing || showForm) && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                        className="px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                                        title="Batalkan"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </Modal>

                    {/* Table Data Tools */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto rounded-2xl">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 border border-slate-200">Nama Alat</th>
                                        <th className="px-6 py-4 border border-slate-200">Deskripsi</th>
                                        <th className="px-6 py-4 border border-slate-200">Kategori</th>
                                        <th className="px-6 py-4 border border-slate-200 text-center">Stok</th>
                                        <th className="px-6 py-4 border border-slate-200 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tools.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-8 text-center text-slate-500"
                                            >
                                                Belum ada alat terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        tools.map((tool) => (
                                            <tr
                                                key={tool.id}
                                                className="hover:bg-slate-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-4 truncate max-w-3xs">
                                                    {tool.name}
                                                </td>

                                                <td className="px-6 py-4 truncate max-w-sm">
                                                    {tool.description}
                                                </td>

                                                <td className="px-6 py-4 truncate">
                                                    {tool.Category?.name || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center">{tool.stock}</td>
                                                <td className="px-6 py-4 text-center min-w-30">
                                                    <button
                                                        onClick={() => handleEdit(tool)}
                                                        className="p-1 text-blue-600 bg-blue-50 rounded-lg cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(tool.id)}
                                                        className="p-1 text-red-600 bg-red-50 rounded-lg cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />

        </div>
    );
}
