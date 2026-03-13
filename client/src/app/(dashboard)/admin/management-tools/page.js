"use client";

import {
    Edit,
    Edit2,
    Layers,
    PackageCheck,
    PackageSearch,
    Plus,
    Trash2,
    X,
} from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchDataComponent";
import Modal from "@/components/ModalComponent";
import Pagination from "@/components/PaginationComponent";
import { useTool } from "@/hooks/admin/useToolManagement";

export default function ToolManagementPage() {

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
        handleShowForm,
        showForm,
        totalItems,
        updateFilters,
        handleSearch,
        page,
        handleFileChange,
        previewUrl,
        selectedFile,
        condition,
        limit
    } = useTool();

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
                    <FilterAndSearchData

                        search={(e) => handleSearch(e.target.value)}
                        sort={(e) => updateFilters('sort', e.target.value)}
                        isShowForm={handleShowForm}
                        showBy={(e) => updateFilters('category', e.target.value)}
                        placeHolderName="Cari nama alat..."
                        label="Kategori"
                        hiddenFilterData={!false}
                        hiddenSearchData={!false}
                        hiddenButtonAddData={!false}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} className="bg-white/20 text-black">{cat.name}</option>
                        ))}
                    </FilterAndSearchData>

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

                        {/* Form Add or Update Tools */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-4">

                                {/* Input Name Tools */}
                                <div className="">
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

                                {/* Input Description Tools */}
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        type="text"
                                        name="description"
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full text-gray-900 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm border-slate-300"
                                        placeholder="Masukkan Deskripsi Alat"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Select Condition */}
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kondisi
                                    </label>
                                    <div className="relative">
                                        <PackageCheck
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <select
                                            name="condition"
                                            value={formData.condition}
                                            onChange={handleChange}
                                            className="w-full pl-9 p-2.5 border rounded-lg text-sm text-slate-700"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Pilih Kondisi</option>
                                            {condition.map((con) => (
                                                <option key={con} value={con}>
                                                    {con}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {error.categoryId && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {error.categoryId.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">

                                    {/* Select Category Tools */}
                                    <div className="w-full">
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

                                    {/* Input Stock Tools */}
                                    <div className="">
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

                                </div>

                                {/* Input Image Tools */}
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Gambar Alat
                                    </label>
                                    <div className={`relative group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>

                                        <input
                                            name="image"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            disabled={isSubmitting}
                                            accept="image/*"
                                        />

                                        <div className="flex flex-col items-center justify-center text-center p-4">
                                            {previewUrl ? (
                                                /* TAMPILAN SAAT FILE SUDAH TERPILIH */
                                                <div className="flex flex-col items-center gap-2">
                                                    <img src={previewUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm mb-1" />
                                                    <p className="text-xs font-medium text-blue-600 truncate max-w-[200px]">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">Klik atau drag untuk mengganti</p>
                                                </div>
                                            ) : (
                                                /* TAMPILAN AWAL (KOSONG) */
                                                <>
                                                    <svg className="w-8 h-8 mb-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className="text-xs text-slate-500">
                                                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">PNG, JPG atau WebP</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Button Save Tools */}
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
                                        <th className="px-6 py-4 border border-slate-200 text-center">No</th>
                                        <th className="px-6 py-4 border border-slate-200">Nama Alat</th>
                                        <th className="px-6 py-4 border border-slate-200">Deskripsi</th>
                                        <th className="px-6 py-4 border border-slate-200">Kategori</th>
                                        <th className="px-6 py-4 border border-slate-200 text-center">Kondisi</th>
                                        <th className="px-6 py-4 border border-slate-200 text-center">Stok</th>
                                        <th className="px-6 py-4 border border-slate-200 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tools.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-8 text-center text-slate-500"
                                            >
                                                Belum ada alat yang terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        tools.map((tool, index) => {
                                            const no = index + 1 + (page - 1) * limit
                                            return (
                                                <tr
                                                    key={tool.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-center">
                                                        {no}
                                                    </td>
                                                    <td className="px-6 py-4 truncate max-w-3xs">
                                                        {tool.name}
                                                    </td>

                                                    <td className="px-6 py-4 truncate max-w-sm">
                                                        {tool.description}
                                                    </td>

                                                    <td className="px-6 py-4 truncate">
                                                        {tool.Category?.name || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {tool.condition}
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
                                            )
                                        })
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
