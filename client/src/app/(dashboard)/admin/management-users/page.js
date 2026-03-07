"use client";

import FilterAndSearchData from "@/components/FilterAndSearchData";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { ShieldCheck, Users, ShieldAlert, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function UserManagementPage() {
    const searchParams = useSearchParams()
    const page = Number(searchParams.get("page"))

    const { users, isLoading, isUpdating, error, updateRole, setSearch, handleShowForm, setSort, totalItems, totalPages, setShowByRole } =
        useUserManagement();

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
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <Users className="text-purple-600" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold">
                            Manajemen Pengguna
                        </h1>
                    </div>
                </div>

                {/* Error Response */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm flex items-start gap-3">
                        <AlertCircle className="mt-0.5 text-red-500" size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-6">

                    <FilterAndSearchData search={(e) => setSearch(e.target.value)} isShowForm={handleShowForm}
                        sort={(e) => setSort(e.target.value)} hidden={true} placeHolderName="Cari nama user..." isRole={true} showByRole={(e) => setShowByRole(e.target.value)} />

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-600">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                    <tr className="text-center">
                                        <th className="px-6 py-4 text-left">Nama Lengkap</th>
                                        <th className="px-6 py-4">Username</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Ubah Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-slate-500 animate-pulse"
                                            >
                                                Sedang mengambil data users...
                                            </td>
                                        </tr>
                                    ) : users.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-slate-500"
                                            >
                                                Tidak terdeteksi adanya entitas pengguna di dalam sistem.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-slate-50/80 transition-colors text-center"
                                            >
                                                <td className="px-6 py-4 truncate max-w-xs text-left">
                                                    {user.fullName}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    @{user.username}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <RoleBadge role={user.role} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => updateRole(user.id, e.target.value)}
                                                        disabled={isUpdating}
                                                        className="p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm bg-slate-50 disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <option value="peminjam">Peminjam</option>
                                                        <option value="petugas">Petugas</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
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

            <Pagination page={page} totalPages={totalPages} totalData={totalItems} />
        </div>
    );
}
