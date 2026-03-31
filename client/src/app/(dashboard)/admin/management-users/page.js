"use client";

import {
    AlertCircle,
    ShieldAlert,
    ShieldCheck,
    Users,
    Edit2,
    Trash2,
    X,
    Edit,
} from "lucide-react";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Pagination from "@/components/Pagination";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import Modal from "@/components/Modal";
import HeaderPage from "@/components/HeaderPage";
import TableCell from "@/components/Table/TableCell";
import ActionButton from "@/components/ActionButton";

export default function UserManagementPage() {
    const {
        users,
        isLoading,
        isEditing,
        error,
        handleShowForm,
        totalItems,
        totalPages,
        page,
        updateFilters,
        handleSearch,
        limit,
        handleEdit,
        formData,
        handleChange,
        isSubmitting,
        showForm,
        handleSubmit,
        resetForm,
        handleDelete,
    } = useUserManagement();

    const userRole = ["Admin", "Petugas", "Peminjam"];

    // Role Badge
    const RoleBadge = ({ role }) => {
        const config = {
            admin: {
                color: "bg-red-100 text-red-700 border-red-200",
                icon: <ShieldAlert size={14} />,
            },
            petugas: {
                color: "bg-blue-100 text-blue-700 border-blue-200",
                icon: <ShieldCheck size={14} />,
            },
            peminjam: {
                color: "bg-slate-100 text-slate-700 border-slate-200",
                icon: <Users size={14} />,
            },
        };
        const current = config[role] || config.peminjam;

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${current.color} uppercase tracking-wider`}
            >
                {current.icon} {role}
            </span>
        );
    };

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<Users className="text-purple-600" size={32} />}
                    title="Manajemen Pengguna"
                />

                {/* Error Response */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3">
                        <AlertCircle className="mt-0.5 text-red-500" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-6">
                    <FilterAndSearchData
                        search={(e) => handleSearch(e.target.value)}
                        isShowForm={handleShowForm}
                        sort={(e) => updateFilters("sort", e.target.value)}
                        hiddenSearchData={!false}
                        placeHolderName="Cari nama user..."
                        hiddenFilterData={!false}
                        showBy={(e) => updateFilters("role", e.target.value)}
                        label="Role"
                    >
                        {userRole.map((role, index) => (
                            <option
                                key={index}
                                value={role.toLowerCase()}
                                className="bg-white/20 text-black"
                            >
                                {role}
                            </option>
                        ))}
                    </FilterAndSearchData>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr className="">
                                        <TableCell isHeader={true} className="text-center">
                                            No
                                        </TableCell>
                                        <TableCell isHeader={true} className="text-left">
                                            Nama Lengkap
                                        </TableCell>
                                        <TableCell isHeader={true} className="text-center">
                                            Username
                                        </TableCell>
                                        <TableCell isHeader={true} className="text-center">
                                            Role
                                        </TableCell>
                                        <TableCell isHeader={true} className="text-center">
                                            Aksi
                                        </TableCell>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <TableCell className="text-center" colspan="5">
                                                Sedang mengambil data users...
                                            </TableCell>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <TableCell className="text-center" colspan="5">
                                                Belum ada pengguna pada sistem ini.
                                            </TableCell>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => {
                                            const no = index + 1 + (page - 1) * limit;

                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-slate-50/80 transition-colors"
                                                >
                                                    <TableCell className="text-center">{no}</TableCell>
                                                    <TableCell className="text-left">{user.fullName}</TableCell>
                                                    <TableCell className="text-center"> @{user.username}</TableCell>
                                                    <TableCell className="text-center">
                                                        <RoleBadge role={user.role} />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <ActionButton
                                                            onClick={() => handleEdit(user)}
                                                            className="p-1 text-blue-600 bg-blue-50 rounded-lg cursor-pointer"
                                                            title="Edit"
                                                            icon={<Edit2 size={16} />}
                                                        />
                                                        <ActionButton
                                                            onClick={() => handleDelete(user.id)}
                                                            className="p-1 text-red-600 bg-red-50 rounded-lg cursor-pointer"
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

                    <Modal
                        customClass={
                            showForm
                                ? "fixed inset-0 flex items-center justify-center z-50"
                                : "hidden"
                        }
                        isOpen={handleShowForm}
                        onClose={handleShowForm}
                    >
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Edit size={18} /> Ubah Data Pengguna
                        </h2>

                        {/* Form Update Users */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                {/* Input Full Name */}
                                <div className="">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full text-gray-900 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm border-slate-300"
                                        placeholder="Nama Lengkap"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Select Role */}
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <Users
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full pl-9 p-2.5 border rounded-lg text-sm text-slate-700"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Pilih Role</option>
                                            {userRole.map((item, index) => (
                                                <option key={index} value={item.toLowerCase()}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* {error.categoryId && (
                                        <span className="text-red-500 text-xs mt-1 block">
                                            {error.categoryId.message}
                                        </span>
                                    )} */}
                                </div>
                            </div>

                            {/* Button Save Update */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Simpan
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
                </div>
            </div>

            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}
