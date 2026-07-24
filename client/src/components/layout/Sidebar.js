"use client";

import { useSidebar } from "@/hooks/useSidebar";
import {
    LogOut,
    Wrench,
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    Folder,
    LayoutDashboard,
    Tags,
    PackageSearch,
    Users,
    ClipboardList,
    ActivitySquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar({ className = "" }) {
    const { pathname, userName, userRole, handleLogout } = useSidebar();
    const [isManageDataOpen, setIsManageDataOpen] = useState(true);

    const renderMenuItems = () => {
        if (userRole === "admin") {
            return (
                <div className="space-y-1">
                    {/* Dashboard */}
                    <Link
                        href="/admin"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/admin"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        <span>Dashboard</span>
                    </Link>

                    {/* Group Label */}
                    <span className="block px-3.5 pt-4 pb-1 text-[10px] font-bold text-text-secondary/60 uppercase tracking-wider">
                        Menu Utama
                    </span>

                    {/* Collapsible Manajemen Data */}
                    <div>
                        <button
                            onClick={() => setIsManageDataOpen(!isManageDataOpen)}
                            className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                                pathname === "/admin/management-categories" ||
                                pathname === "/admin/management-tools" ||
                                pathname === "/admin/management-users"
                                    ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                    : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Folder size={18} className="shrink-0" />
                                <span>Manajemen Data</span>
                            </div>
                            {isManageDataOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>

                        {isManageDataOpen && (
                            <div className="relative pl-6 border-l border-border-subtle ml-5.5 space-y-1.5 my-1.5">
                                <Link
                                    href="/admin/management-categories"
                                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                        pathname === "/admin/management-categories"
                                            ? "text-emerald-500 font-bold"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    <Tags size={14} className="shrink-0" />
                                    <span>Kategori</span>
                                </Link>
                                <Link
                                    href="/admin/management-tools"
                                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                        pathname === "/admin/management-tools"
                                            ? "text-emerald-500 font-bold"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    <PackageSearch size={14} className="shrink-0" />
                                    <span>Alat</span>
                                </Link>
                                <Link
                                    href="/admin/management-users"
                                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                        pathname === "/admin/management-users"
                                            ? "text-emerald-500 font-bold"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    <Users size={14} className="shrink-0" />
                                    <span>Pengguna</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Transaksi Peminjaman */}
                    <Link
                        href="/admin/loan-transactions"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/admin/loan-transactions"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <ClipboardList size={18} className="shrink-0" />
                        <span>Transaksi Peminjaman</span>
                    </Link>

                    {/* Log Aktivitas */}
                    <Link
                        href="/admin/activity-logs"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/admin/activity-logs"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <ActivitySquare size={18} className="shrink-0" />
                        <span>Log Aktivitas</span>
                    </Link>
                </div>
            );
        }

        if (userRole === "petugas") {
            return (
                <div className="space-y-1">
                    {/* Dashboard */}
                    <Link
                        href="/officer"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/officer"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        <span>Dashboard</span>
                    </Link>

                    {/* Group Label */}
                    <span className="block px-3.5 pt-4 pb-1 text-[10px] font-bold text-text-secondary/60 uppercase tracking-wider">
                        Menu Utama
                    </span>

                    {/* Daftar Peminjaman */}
                    <Link
                        href="/officer/loan-requests"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/officer/loan-requests"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <ClipboardList size={18} className="shrink-0" />
                        <span>Daftar Peminjaman</span>
                    </Link>
                </div>
            );
        }

        if (userRole === "peminjam") {
            return (
                <div className="space-y-1">
                    {/* Dashboard */}
                    <Link
                        href="/borrower"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/borrower"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <LayoutDashboard size={18} className="shrink-0" />
                        <span>Dashboard</span>
                    </Link>

                    {/* Group Label */}
                    <span className="block px-3.5 pt-4 pb-1 text-[10px] font-bold text-text-secondary/60 uppercase tracking-wider">
                        Menu Utama
                    </span>

                    {/* Katalog Alat */}
                    <Link
                        href="/borrower/tools-catalog"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/borrower/tools-catalog"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <PackageSearch size={18} className="shrink-0" />
                        <span>Katalog Alat</span>
                    </Link>

                    {/* Riwayat Transaksi */}
                    <Link
                        href="/borrower/transactions-history"
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                            pathname === "/borrower/transactions-history"
                                ? "bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
                                : "text-text-secondary hover:bg-app-bg hover:text-text-primary"
                        }`}
                    >
                        <ClipboardList size={18} className="shrink-0" />
                        <span>Riwayat Transaksi</span>
                    </Link>
                </div>
            );
        }

        return null;
    };

    return (
        <aside
            className={`bg-card-bg w-64 z-20 text-text-secondary min-h-screen flex flex-col shadow-xl border-r border-border-subtle transition-colors duration-200 ${className}`}
        >
            {/* Header Switcher */}
            <div className="p-3 mx-2 my-2 rounded-xl flex items-center justify-between hover:bg-app-bg cursor-pointer border border-transparent hover:border-border-subtle/40 transition-all duration-200">
                <div className="flex items-center gap-2.5">
                    <div className="bg-emerald-600 rounded-lg p-2 text-white flex items-center justify-center shadow-md">
                        <Wrench size={16} />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-text-primary tracking-tight">Pinjamku</span>
                        <span className="text-[10px] text-text-secondary/60 font-semibold uppercase tracking-wider">
                            {userRole === "admin" ? "Enterprise" : userRole === "petugas" ? "Officer Panel" : "Borrower Panel"}
                        </span>
                    </div>
                </div>
                <ChevronsUpDown size={14} className="text-text-secondary/60 shrink-0" />
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 overflow-y-auto py-2 px-3">
                {renderMenuItems()}
            </nav>

            {/* User Profile Bar */}
            <div className="p-3 border-t border-border-subtle mt-auto flex items-center justify-between gap-3 bg-app-bg/40">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-text-primary truncate">
                            {userName || "Memuat..."}
                        </span>
                        <span className="text-[10px] text-text-secondary/60 truncate font-semibold uppercase tracking-wider">
                            {userRole || "User"}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-text-secondary hover:text-rose-600 hover:bg-app-bg rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Keluar dari Aplikasi"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    );
}
