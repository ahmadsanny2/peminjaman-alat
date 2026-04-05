"use client";

import { Edit, Edit2, Plus, Tags, Trash2, X } from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useCategory } from "@/hooks/admin/useCategoryManagement";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Label from "@/components/Form/Label";
import Button from "@/components/Form/Button";
import ActionButton from "@/components/ActionButton";
import HeaderPage from "@/components/HeaderPage";
import HeaderForm from "@/components/Form/HeaderForm";
import TableCell from "@/components/Table/TableCell";
import Alert from "@/components/Alert";
import Confirmation from "@/components/Modals/Confirmation";

export default function CategoryManagementContent() {
    // Category Management Data
    const {
        categories,
        totalPages,
        formData,
        isEditing,
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
        success,
        setShowConfirm,
        showConfirm,
        openDeleteConfirm,
        setSelectedId
    } = useCategory();

    const tableTH = [
        {
            name: "No",
            className: "w-20 text-center",
        },
        {
            name: "Nama Kategori",
            className: "min-w-100 lg:w-150 text-left",
        },
        {
            name: "Deskripsi",
            className: "min-w-150 lg:w-200 text-justify",
        },
        {
            name: "Aksi",
            className: "w-30 text-center",
        },
    ];

    let content = "";

    if (isLoading) {
        content = (
            <tr>
                <TableCell colspan="4" className="text-center">
                    Sedang mengambil data...
                </TableCell>
            </tr>
        );
    } else if (categories.length === 0) {
        content = (
            <tr>
                <TableCell colspan="4" className="text-center">
                    Belum ada kategori terdaftar.
                </TableCell>
            </tr>
        );
    } else {
        content = categories.map((category, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr
                    key={category.id}
                    className="hover:bg-slate-50/80 transition-colors"
                >
                    {/* No */}
                    <TableCell className="w-20 text-center">{no}</TableCell>

                    {/* Category Name */}
                    <TableCell className="min-w-100 lg:w-150 text-left">
                        {category.name}
                    </TableCell>

                    {/* Description */}
                    <TableCell className="min-w-150 lg:w-200 text-justify">
                        {category.description || "-"}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="w-30 text-center">
                        <div className="flex flex-col gap-2">
                            <ActionButton
                                onClick={() => handleEdit(category)}
                                icon={<Edit2 size={16} />}
                                title="Edit"
                                name="Edit"
                            />
                            <ActionButton
                                onClick={() => openDeleteConfirm(category.id)}
                                color="rose"
                                icon={<Trash2 size={16} />}
                                title="Hapus"
                                name="Hapus"
                            />
                        </div>
                    </TableCell>
                </tr>
            );
        });
    }

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<Tags className="text-emerald-600" size={32} />}
                    title="Manajemen Kategori"
                />

                {/* Alert */}
                {(error || success) && (
                    <Alert type={error ? "error" : "success"} message={error || success} />
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
                        <HeaderForm
                            icon={isEditing ? <Edit size={18} /> : <Plus size={18} />}
                            title={isEditing ? "Ubah Kategori" : "Tambah Kategori"}
                        />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label name="Nama Kategori" />
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nama Kategori"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <Label name="Deskripsi" />
                                <TextArea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Deskripsi"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    disabled={isLoading}
                                    name={isEditing ? "Simpan" : "Tambah"}
                                />
                                <Button
                                    buttonType
                                    disabled={isLoading}
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
                                        {tableTH.map((th, index) => (
                                            <TableCell
                                                key={index}
                                                isHeader={true}
                                                className={th.className}
                                            >
                                                {th.name}
                                            </TableCell>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">{content}</tbody>
                            </table>

                            <Confirmation
                                isOpen={showConfirm}
                                title="Konfirmasi Hapus"
                                message="Yakin ingin menghapus kategori ini? Data yang dihapus tidak dapat dikembalikan."
                                onConfirm={handleDelete} 
                                onCancel={() => {
                                    setShowConfirm(false);
                                    setSelectedId(null);
                                }}
                                confirmText="Hapus"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}