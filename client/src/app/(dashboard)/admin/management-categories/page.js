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
import ActionButton from "@/components/ActionButton";
import HeaderPage from "@/components/HeaderPage";
import HeaderForm from "@/components/Form/HeaderForm";
import TableCell from "@/components/Table/TableCell";

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
        isLoading,
    } = useCategory();

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<Tags className="text-emerald-600" size={32} />}
                    title="Manajemen Kategori"
                />

                {/* Error Response */}
                {error && <AlertComponent message={error} isSuccess={false} />}

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
                        <HeaderForm
                            icon={isEditing ? <Edit size={18} /> : <Plus size={18} />}
                            title={isEditing ? "Ubah Kategori" : "Tambah Kategori"}
                        />

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
                                        <TableCell isHeader={true} className="text-center">
                                            No
                                        </TableCell>
                                        <TableCell isHeader={true} className="text-left min-w-50">Nama Kategori</TableCell>
                                        <TableCell isHeader={true} className="text-left">Deskripsi</TableCell>
                                        <TableCell isHeader={true} className="text-center min-w-30">
                                            Aksi
                                        </TableCell>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <TableCell colspan="4" className="text-center">
                                                Sedang mengambil data kategori.
                                            </TableCell>
                                        </tr>
                                    ) : categories.length === 0 ? (
                                        <tr>
                                            <TableCell colspan="4" className="text-center">
                                                Belum ada kategori terdaftar.
                                            </TableCell>
                                        </tr>
                                    ) : (
                                        categories.map((category, index) => {
                                            const no = index + 1 + (page - 1) * limit;
                                            return (
                                                <tr
                                                    key={category.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >
                                                    <TableCell className="text-center">{no}</TableCell>
                                                    <TableCell className="text-left min-w-50">{category.name}</TableCell>
                                                    <TableCell className="text-justify min-w-150">
                                                        {category.description || "-"}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <ActionButton
                                                            onClick={() => handleEdit(category)}
                                                            className="text-blue-600 bg-blue-50"
                                                            title="Edit"
                                                            icon={<Edit2 size={16} />}
                                                        />
                                                        <ActionButton
                                                            onClick={() => handleDelete(category.id)}
                                                            className="text-red-600 bg-red-50"
                                                            title="Hapus"
                                                            icon={<Trash2 size={16} />}
                                                        />
                                                    </TableCell>
                                                </tr>
                                            );
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
