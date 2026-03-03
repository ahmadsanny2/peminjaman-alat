"use client";

import { useCategory } from "@/hooks/admin/useCategoryManagement";
import { Edit, Trash2, Plus, X, Tags, Edit2, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryManagementPage() {

    const searchParams = useSearchParams();
    const router = useRouter();

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
    } = useCategory(page, 5);

    return (
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

            {/* Main Content */}
            <div className="flex flex-col gap-2">

                <div className="flex flex-col gap-2">

                    {/* Form */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
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

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                        className="px-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                                        title="Batalkan"
                                    >
                                        <X size={20} />
                                    </button>
                                )}

                            </div>
                        </form>
                    </div>

                    {/* Table Data Category */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-90">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr>

                                        <th className="px-6 py-4">Nama Kategori</th>
                                        <th className="px-6 py-4">Deskripsi</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                                Belum ada kategori terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="hover:bg-slate-50/80 transition-colors"
                                            >
                                                <td className="px-6 py-4 truncate max-w-xs">{category.name}</td>
                                                <td className="px-6 py-4 truncate max-w-xs">{category.description || "-"}</td>
                                                <td className="px-6 py-4 text-center">
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

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-3 border border-slate-800 rounded-2xl">
                    <span className="text-xs text-slate-500 font-medium">
                        Halaman {page} dari {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => router.push(`?page=${page - 1}`)}
                            className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-default"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => router.push(`?page=${page + 1}`)}
                            className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-default"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}
