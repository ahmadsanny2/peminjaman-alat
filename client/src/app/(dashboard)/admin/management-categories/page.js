"use client";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useCategory } from "@/hooks/admin/useCategoryManagement";
import {
    Edit,
    Trash2,
    Plus,
    X,
    Tags,
    Edit2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CategoryManagementPage() {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;

    // Category Management Data
    const {
        categories,
        totalPages,
        formData,
        isEditing,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        setSort,
        setSearch,
        handleShowForm,
        showForm,
        totalItems
    } = useCategory(page, 10);

    return (
        <div className="flex flex-col justify-between h-full space-y-6">

            <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <Tags className="text-emerald-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
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
                    <FilterAndSearchData search={(e) => setSearch(e.target.value)} sort={(e) => setSort(e.target.value)} isShowForm={handleShowForm} placeHolderName="Cari nama kategori..." />

                    {/* Form */}
                    <Modal customClass={showForm ? 'fixed inset-0 h-full flex items-center justify-center' : 'hidden'} isOpen={handleShowForm} onClose={handleShowForm}>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Edit size={18} /> Ubah Kategori
                                </>
                            ) : (
                                <>
                                    <Plus size={18} /> Tambah Kategori
                                </>
                            )}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nama Kategori
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full text-gray-900 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm border-slate-300"
                                    placeholder="Contoh: Alat Kelistrikan"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full text-gray-900 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm resize-none"
                                    placeholder="Definisi operasional dari kategori ini..."
                                    disabled={isSubmitting}
                                ></textarea>
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
                                        className="px-3 bg-red-500 rounded-lg hover:bg-red-600 text-white transition-colors cursor-pointer"
                                        title="Batalkan"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </Modal>

                    {/* Table Data Category */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 border border-slate-200 text-left">
                                            Nama Kategori
                                        </th>
                                        <th className="px-6 py-4 border border-slate-200 text-left">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-4 border border-slate-200">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-4 text-center text-slate-500"
                                            >
                                                Belum ada kategori terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-slate-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-4 truncate max-w-xs">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 truncate max-w-xs">
                                                    {category.description || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center min-w-30">
                                                    <button
                                                        onClick={() => handleEdit(category)}
                                                        className="p-1 text-blue-600 bg-blue-50 rounded-lg cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
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
