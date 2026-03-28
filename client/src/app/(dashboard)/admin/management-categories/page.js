"use client";

import { Edit, Edit2, Plus, Tags, Trash2, X } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useCategory } from "@/hooks/admin/useCategoryManagement";
import AlertComponent from "@/components/Alert";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Label from "@/components/Form/Label";
import Button from "@/components/Button";

export default function CategoryManagementPage() {
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
        handleShowForm,
        showForm,
        totalItems,
        page,
        limit,
        updateFilters,
        handleSearch,
        isLoading
    } = useCategory();

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
                    <AlertComponent message={error} isSuccess={false} />
                )}

                {/* Content */}
                <div className="space-y-6">
                    {/* Filter and Search Category */}
                    <FilterAndSearchData
                        search={(e) => handleSearch(e.target.value)}
                        sort={(e) => updateFilters("sort", e.target.value)}
                        isShowForm={handleShowForm}
                        placeHolderName="Cari nama kategori..."
                        hiddenSearchData={!false}
                        hiddenButtonAddData={!false}
                    />

                    {/* Form */}
                    <Modal
                        customClass={
                            showForm
                                ? "fixed inset-0 h-full flex items-center justify-center"
                                : "hidden"
                        }
                        isOpen={handleShowForm}
                        onClose={handleShowForm}
                    >
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
                                <Label name=" Nama Kategori" />
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Alat Kelistrikan"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <Label name="Deskripsi" />
                                <TextArea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Definisi operasional dari kategori ini..."
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    disabled={isSubmitting}
                                    name={isEditing ? "Simpan" : "Tambah"}
                                />
                                <Button
                                    buttonType
                                    disabled={isSubmitting}
                                    onClick={resetForm}
                                    cancel
                                    icon={<X size={20} />}
                                />
                            </div>
                        </form>
                    </Modal>

                    {/* Table Data Category */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr>
                                        <th className="border-slate-200 px-6 py-4 border text-center">
                                            No
                                        </th>
                                        <th className="border-slate-200 px-6 py-4 border text-left min-w-xs max-w-xs">
                                            Nama Kategori
                                        </th>
                                        <th className="border-slate-200 px-6 py-4 border text-left min-w-xl max-w-xl">
                                            Deskripsi
                                        </th>
                                        <th className="border-slate-200 px-6 py-4 border">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-slate-500"
                                            >
                                                Sedang mengambil data kategori.
                                            </td>
                                        </tr>
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-slate-500"
                                            >
                                                Belum ada kategori terdaftar.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category, index) => {
                                            const no = index + 1 + (page - 1) * limit
                                            return (
                                                <tr
                                                    key={category.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-center">

                                                        {no}
                                                    </td>
                                                    <td className="px-6 py-4 truncate min-w-xs max-w-xs">
                                                        {category.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-justify min-w-xl max-w-xl">
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
