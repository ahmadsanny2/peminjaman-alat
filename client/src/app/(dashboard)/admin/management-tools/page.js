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
import Button from "@/components/Button";
import HeaderPage from "@/components/HeaderPage";
import HeaderForm from "@/components/Form/HeaderForm";
import TableCell from "@/components/Table/TableCell";
import ActionButton from "@/components/ActionButton";

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
        limit,
    } = useTool();

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<PackageSearch className="text-red-600" size={32} />}
                    title="Manajemen Alat"
                />

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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
                                                disabled={isSubmitting}
                                            >
                                                <Option optionName="Pilih Kondisi" optionValue="" />
                                                {condition.map((con) => (
                                                    <Option key={con} optionName={con} optionValue={con} />
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
                                            disabled={isSubmitting}
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
                                            disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                    name={isEditing ? "Simpan" : "Tambah"}
                                />
                                <Button
                                    buttonType
                                    cancel
                                    onClick={resetForm}
                                    disabled={isSubmitting}
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
                                        <TableCell isHeader={true} className="text-center">No</TableCell>
                                        <TableCell isHeader={true} className="text-left">Nama Alat</TableCell>
                                        <TableCell isHeader={true} className="text-left">Deskripsi</TableCell>
                                        <TableCell isHeader={true} className="min-w-100 text-left">Kategori</TableCell>
                                        <TableCell isHeader={true} className="text-center">Kondisi</TableCell>
                                        <TableCell isHeader={true} className="text-center">Stok</TableCell>
                                        <TableCell isHeader={true} className="text-center">Aksi</TableCell>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tools.length === 0 ? (
                                        <tr>
                                            <TableCell colspan="7" className="text-center">Belum ada alat yang terdaftar.</TableCell>
                                        </tr>
                                    ) : (
                                        tools.map((tool, index) => {
                                            const no = index + 1 + (page - 1) * limit;
                                            return (
                                                <tr
                                                    key={tool.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >
                                                    <TableCell className="min-w-20 text-center">{no}</TableCell>
                                                    <TableCell className="min-w-100">{tool.name}</TableCell>
                                                    <TableCell className="min-w-100">{tool.description}</TableCell>
                                                    <TableCell>{tool.Category?.name || "-"}</TableCell>
                                                    <TableCell className="text-center">{tool.condition}</TableCell>
                                                    <TableCell className="text-center">{tool.stock}</TableCell>
                                                    <td className="px-6 py-4 text-center min-w-30">
                                                        <ActionButton
                                                            onClick={() => handleEdit(tool)}
                                                            className="p-1 text-blue-600 bg-blue-50 rounded-lg cursor-pointer"
                                                            title="Edit"
                                                            icon={<Edit2 size={16} />}
                                                        />
                                                        <ActionButton
                                                            onClick={() => handleDelete(tool.id)}
                                                            className="p-1 text-red-600 bg-red-50 rounded-lg cursor-pointer"
                                                            title="Hapus"
                                                            icon={<Trash2 size={16} />}
                                                        />
                                                    </td>
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
