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
import HeaderForm from "@/components/Form/HeaderForm";
import Label from "@/components/Form/Label";
import Input from "@/components/Form/Input";
import Select from "@/components/Form/Select";
import Option from "@/components/Form/Option";
import Button from "@/components/Form/Button";
import Alert from "@/components/Alert";

export default function UserManagementContent() {
    const {
        users,
        isLoading,
        error,
        success,
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

    const tableTH = [
        {
            name: "No",
            className: "w-20 text-center",
        },
        {
            name: "Nama Lengkap",
            className: "min-w-50 text-left"
        },
        {
            name: "Username",
            className: "min-w-30 text-center"
        },
        {
            name: "Role",
            className: "text-center"
        },
        {
            name: "Aksi",
            className: "w-30 text-center"
        }
    ]

    let content

    if (isLoading) {
        content = (
            <tr>
                <TableCell className="text-center" colspan="5">
                    Sedang mengambil data users...
                </TableCell>
            </tr>
        )
    } else if (users.length === 0) {
        content = (
            <tr>
                <TableCell className="text-center" colspan="5">
                    Belum ada pengguna pada sistem ini.
                </TableCell>
            </tr>
        )
    } else {
        content = (
            users.map((user, index) => {
                const no = index + 1 + (page - 1) * limit;

                return (
                    <tr
                        key={user.id}
                        className="hover:bg-slate-50/80 transition-colors"
                    >
                        <TableCell className="w-20 text-center">{no}</TableCell>
                        <TableCell className="min-w-50 text-left">{user.fullName}</TableCell>
                        <TableCell className="min-w-30 text-center"> @{user.username}</TableCell>
                        <TableCell className="text-center">
                            <RoleBadge role={user.role} />
                        </TableCell>
                        <TableCell className="w-30 text-center">
                            <div className="flex flex-col gap-2">
                                <ActionButton
                                    onClick={() => handleEdit(user)}
                                    icon={<Edit2 size={16} />}
                                    title="Edit"
                                    name="Edit"
                                />
                                <ActionButton
                                    onClick={() => handleDelete(user.id)}
                                    icon={<Trash2 size={16} />}
                                    color="rose"
                                    title="Hapus"
                                    name="Hapus"
                                />
                            </div>
                        </TableCell>
                    </tr>
                );
            })
        )
    }

    return (
        <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
                {/* Header */}
                <HeaderPage
                    icon={<Users className="text-purple-600" size={32} />}
                    title="Manajemen Pengguna"
                />

                {/* Error Response */}
                {(error || success) && (
                    <Alert type={error ? "error" : "success"} message={error || success} />
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
                                        {tableTH.map((th, index) => (
                                            <TableCell key={index} isHeader={true} className={th.className}>
                                                {th.name}
                                            </TableCell>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {content}
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
                        <HeaderForm
                            icon={<Edit size={18} />}
                            title="Ubah Data Pengguna"
                        />

                        {/* Form Update Users */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col space-y-4">
                                {/* Input Full Name */}
                                <div className="">
                                    <Label name="Nama Lengkap" />
                                    <Input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Nama Lengkap"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Select Role */}
                                <div className="w-full">
                                    <Label name="Role" />
                                    <div className="relative">
                                        <Users
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={16}
                                        />
                                        <Select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full pl-9 p-2.5 border rounded-lg text-sm text-slate-700"
                                            disabled={isLoading}
                                        >
                                            <Option optionValue="" optionName="Pilih Role" />
                                            {userRole.map((item, index) => (
                                                <Option key={index} optionValue={item.toLowerCase()} optionName={item} />
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Button Save Update */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    disabled={isLoading}
                                    name="Simpan"
                                />
                                <Button
                                    buttonType
                                    onClick={resetForm}
                                    disabled={isLoading}
                                    title="Batalkan"
                                    icon={<X size={20} />}
                                    cancel
                                />
                            </div>
                        </form>
                    </Modal>
                </div>
            </div>

            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}
