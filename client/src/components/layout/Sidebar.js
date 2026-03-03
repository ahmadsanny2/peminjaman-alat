"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
    LayoutDashboard,
    PackageSearch,
    Users,
    ClipboardList,
    LogOut,
    Tags,
    ActivitySquare,
} from "lucide-react";

export default function Sidebar({ className = "" }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("");

    // User Cookie
    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (userCookie) {
            const parsedUser = JSON.parse(userCookie);
            setUserRole(parsedUser.role);
            setUserName(parsedUser.fullName);
        }
    }, []);

    // Sidebar Menu
    const menuConfig = {
        admin: [
            {
                title: "Dashboard",
                path: "/admin",
                icon: <LayoutDashboard size={20} />,
            },
            {
                title: "Manajemen Kategori",
                path: "/admin/management-categories",
                icon: <Tags size={20} />,
            },
            {
                title: "Manajemen Alat",
                path: "/admin/management-tools",
                icon: <PackageSearch size={20} />,
            },
            {
                title: "Manajemen Pengguna",
                path: "/admin/management-users",
                icon: <Users size={20} />,
            },
            {
                title: "Transaksi Peminjaman",
                path: "/admin/loan-transactions",
                icon: <ClipboardList size={20} />,
            },
            {
                title: "Log Aktivitas",
                path: "/admin/activity-logs",
                icon: <ActivitySquare size={20} />,
            },
        ],
        petugas: [
            {
                title: "Dashboard",
                path: "/officer",
                icon: <LayoutDashboard size={20} />,
            },
            {
                title: "Daftar Peminjaman",
                path: "/officer/loan-requests",
                icon: <ClipboardList size={20} />,
            },
        ],
        peminjam: [
            {
                title: "Dashboard",
                path: "/borrower",
                icon: <LayoutDashboard size={20} />,
            },
            {
                title: "Katalog Alat",
                path: "/borrower/tools-catalog",
                icon: <PackageSearch size={20} />,
            },
            {
                title: "Riwayat Transaksi",
                path: "/borrower/transactions-history",
                icon: <ClipboardList size={20} />,
            },
        ],
    };

    const activeMenu = menuConfig[userRole] || [];

    // Handle Logout
    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        router.push("/login");
    };

    return (
        <aside
            className={`bg-slate-900 w-64 text-slate-300 min-h-screen flex flex-col shadow-xl border-r border-gray-800 ${className}`}
        >

            {/* Header */}
            <div className="h-16 flex items-center justify-center border-b border-slate-200">
                <h1 className="text-white font-bold text-lg tracking-wider">
                    Peminjaman Alat
                </h1>
            </div>

            {/* Username and Role */}
            <div className="p-4 text-center">
                <p className="text-lg font-bold text-slate-100 truncate">
                    {userName || "Memuat..."}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-blue-900/50 text-blue-400 rounded border border-blue-700/50">
                    {userRole.toUpperCase()}
                </span>
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {activeMenu.map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={index}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-blue-600 text-white font-medium shadow-md"
                                        : "hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 w-full bg-red-600 hover:bg-red-700 hover:text-red-300 rounded-lg transition-colors cursor-pointer justify-center"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
            
        </aside>
    );
}
