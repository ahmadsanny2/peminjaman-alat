"use client";

import { useTool } from "@/hooks/admin/useToolManagement";
import {
    Edit,
    Trash2,
    Plus,
    X,
    PackageSearch,
    Layers,
    Tags,
    Edit2,
} from "lucide-react";

export default function ToolManagementPage() {
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
    } = useTool();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <PackageSearch className="text-red-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Alat</h1>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
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
                            <div>
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

                            <div>
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
                </div>

                {/* Tabel Kategori */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Nama Alat</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4">Stok</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tools.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="3"
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
                                                <td className="px-6 py-4 truncate max-w-xs">
                                                    {tool.name}
                                                </td>

                                                <td className="px-6 py-4 truncate max-w-xs">
                                                    {tool.Category?.name || "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tool.stock}
                                                </td>
                                                <td className="px-6 py-4 text-center">
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
        </div>
    );
}
