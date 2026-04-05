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

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useTool } from "@/hooks/admin/useToolManagement";
import Label from "@/components/Form/Label";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Select from "@/components/Form/Select";
import Option from "@/components/Form/Option";
import Button from "@/components/Form/Button";
import HeaderPage from "@/components/HeaderPage";
import HeaderForm from "@/components/Form/HeaderForm";
import TableCell from "@/components/Table/TableCell";
import ActionButton from "@/components/ActionButton";
import Alert from "@/components/Alert";
import Confirmation from "@/components/Modals/Confirmation";

export default function ToolManagementContent() {
    // Tools Management Data
    const {
        tools,
        categories,
        formData,
        isEditing,
        error,
        success,
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
        limit,
        isLoading,
        showConfirm,
        setShowConfirm,
        setSelectedId,
        openDeleteConfirm
    } = useTool();

    const tableTH = [
        {
            name: "No",
            className: "w-20 text-center",
        },
        {
            name: "Nama Alat",
            className: "min-w-80 text-left",
        },
        {
            name: "Deskripsi",
            className: "min-w-100 text-left",
        },
        {
            name: "Kategori",
            className: "min-w-70 text-left",
        },
        {
            name: "Kondisi",
            className: "text-center",
        },
        {
            name: "Stok",
            className: "text-center",
        },
        {
            name: "Aksi",
            className: "w-30 text-center",
        },
    ];

    let content;

    if (isLoading) {
        content = (
            <tr>
                <TableCell colspan="7" className="text-center">
                    Sedang mengambil data...
                </TableCell>
            </tr>
        );
    } else if (tools.length === 0) {
        content = (
            <tr>
                <TableCell colspan="7" className="text-center">
                    Belum ada alat yang terdaftar.
                </TableCell>
            </tr>
        );
    } else {
        content = tools.map((tool, index) => {
            const no = index + 1 + (page - 1) * limit;
            return (
                <tr key={tool.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell className="w-20 text-center">{no}</TableCell>
                    <TableCell className="">{tool.name}</TableCell>
                    <TableCell className="">{tool.description}</TableCell>
                    <TableCell>{tool.Category?.name || "-"}</TableCell>
                    <TableCell className="text-center">{tool.condition}</TableCell>
                    <TableCell className="text-center">{tool.stock}</TableCell>
                    <TableCell className="w-30 text-center">
                        <div className="flex flex-col gap-2">
                            <ActionButton
                                onClick={() => handleEdit(tool)}
                                icon={<Edit2 size={16} />}
                                title="Edit"
                                name="Edit"
                            />
                            <ActionButton
                                onClick={() => openDeleteConfirm(tool.id)}
                                icon={<Trash2 size={16} />}
                                color="rose"
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
                    icon={<PackageSearch className="text-red-600" size={32} />}
                    title="Manajemen Alat"
                />

                {/* Error Response */}
                {(error || success) && (
                    <Alert
                        type={error ? "error" : "success"}
                        message={error || success}
                    />
                )}

                {/* Content */}
                <div className="space-y-6">
                    {/* Filter and Search Category */}
                    <FilterAndSearchData
                        search={(e) => handleSearch(e.target.value)}
                        sort={(e) => updateFilters("sort", e.target.value)}
                        isShowForm={handleShowForm}
                        showBy={(e) => updateFilters("category", e.target.value)}
                        placeHolderName="Cari nama alat..."
                        label="Kategori"
                        hiddenFilterData={!false}
                        hiddenSearchData={!false}
                        hiddenButtonAddData={!false}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} className="bg-white/20 text-black">
                                {cat.name}
                            </option>
                        ))}
                    </FilterAndSearchData>

                    {/* Form */}
                    <Modal
                        customClass={
                            showForm
                                ? "fixed inset-0 flex items-center justify-center z-50"
                                : "hidden"
                        }
                        isOpen={handleShowForm}
                        onClose={handleShowForm}
                    >
                        <HeaderForm
                            icon={isEditing ? <Edit size={18} /> : <Plus size={18} />}
                            title={isEditing ? "Ubah Alat" : "Tambah Alat"}
                        />

                        {/* Form Add or Update Tools */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                {/* Input Name Tools */}
                                <div className="">
                                    <Label name="Nama Alat" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Masukan Nama Alat"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Input Description Tools */}
                                <div className="">
                                    <Label name="Deskripsi" />
                                    <TextArea
                                        type="text"
                                        name="description"
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Masukkan Deskripsi Alat"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Select Category Tools */}
                                <div className="w-full">
                                    <Label name="Kategori" />
                                    <div className="relative">
                                        <Layers
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <Select
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleChange}
                                            className="w-full pl-9 p-2.5 border rounded-lg text-sm text-slate-700"
                                            disabled={isLoading}
                                        >
                                            <Option optionName="Pilih Kategori" optionValue="" />
                                            {categories.map((category) => (
                                                <Option
                                                    key={category.id}
                                                    optionValue={category.id}
                                                    optionName={category.name}
                                                />
                                            ))}
                                        </Select>
                                    </div>
                                    {error.categoryId && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {errors.categoryId.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {/* Select Condition */}
                                    <div className="w-full">
                                        <Label name="Kondisi" />
                                        <div className="relative">
                                            <PackageCheck
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                size={16}
                                            />
                                            <Select
                                                name="condition"
                                                value={formData.condition}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                <Option optionName="Pilih Kondisi" optionValue="" />
                                                {condition.map((con) => (
                                                    <Option
                                                        key={con}
                                                        optionName={con}
                                                        optionValue={con}
                                                    />
                                                ))}
                                            </Select>
                                        </div>
                                        {error.categoryId && (
                                            <span className="text-red-500 text-xs mt-1 block">
                                                {error.categoryId.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Input Stock Tools */}
                                    <div className="">
                                        <Label name="Stok" />
                                        <Input
                                            name="stock"
                                            type="number"
                                            value={formData.stock}
                                            min={0}
                                            onChange={handleChange}
                                            placeholder="0"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Input Image Tools */}
                                <div className="">
                                    <Label name="Gambar Alat" />
                                    <div
                                        className={`relative group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all cursor-pointer ${selectedFile ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
                                    >
                                        <Input
                                            name="image"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            disabled={isLoading}
                                            accept="image/*"
                                        />

                                        <div className="flex flex-col items-center justify-center text-center p-4">
                                            {previewUrl ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="h-20 w-20 object-cover rounded-lg shadow-sm mb-1"
                                                    />
                                                    <p className="text-xs font-medium text-blue-600 truncate max-w-[200px]">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        Klik atau drag untuk mengganti
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="w-8 h-8 mb-3 text-slate-400 group-hover:text-blue-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        />
                                                    </svg>
                                                    <p className="text-xs text-slate-500">
                                                        <span className="font-semibold">
                                                            Klik untuk upload
                                                        </span>{" "}
                                                        atau drag & drop
                                                    </p>
                                                    <p className="text-[10px] text-slate-400">
                                                        PNG, JPG atau WebP
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Button Save Tools */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    disabled={isLoading}
                                    name={isEditing ? "Simpan" : "Tambah"}
                                />
                                <Button
                                    buttonType
                                    cancel
                                    onClick={resetForm}
                                    disabled={isLoading}
                                    icon={<X size={20} />}
                                />
                            </div>
                        </form>
                    </Modal>

                    {/* Table Data Tools */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto rounded-2xl">
                            <table className="w-full text-left text-sm text-slate-600">
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
                                message="Yakin ingin menghapus alat ini? Data yang dihapus tidak dapat dikembalikan."
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
