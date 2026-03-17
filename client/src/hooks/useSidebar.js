import {
    PackageSearch,
    Tags,
    Users,
    ActivitySquare,
    ClipboardList,
    LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLogout } from "./auth/useLogout";
import { usePathname } from "next/navigation";

export function useSidebar() {
    const { handleLogout, Cookies } = useLogout();

    const pathname = usePathname();

    const [sidebar, setSidebar] = useState(false);
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

    return {
        sidebar,
        setSidebar,
        pathname,
        userName,
        userRole,
        activeMenu,
        handleLogout,
    };
}
