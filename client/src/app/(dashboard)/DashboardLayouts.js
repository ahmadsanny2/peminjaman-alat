"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Calendar, PanelLeft, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { isDark, toggle } = useDarkMode();
    const [currentDate, setCurrentDate] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobile(true);
                setSidebarOpen(false);
            } else {
                setIsMobile(false);
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auto close sidebar on mobile when navigating
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [pathname]);

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour12: false,
        }));
    }, []);

    return (
        <div className="bg-app-bg text-text-primary flex h-screen overflow-hidden font-sans transition-colors duration-200 relative">

            {/* Mobile Backdrop Overlay */}
            {sidebarOpen && isMobile && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <Sidebar
                onClose={() => setSidebarOpen(false)}
                className={`fixed inset-y-0 left-0 lg:relative z-50 lg:z-20 ${
                    sidebarOpen
                        ? "translate-x-0 opacity-100 lg:ml-0"
                        : "-translate-x-full opacity-0 pointer-events-none lg:opacity-0 lg:pointer-events-none lg:-ml-64"
                }`}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header Topbar */}
                <header className="h-16 bg-card-bg border-b border-border-subtle flex items-center justify-between px-4 lg:px-6 shadow-xs z-10 shrink-0">

                    {/* Sidebar Toggle Button */}
                    <button
                        className="p-2 text-text-secondary hover:text-text-primary hover:bg-app-bg rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        aria-label="Toggle Sidebar"
                        title={sidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
                    >
                        <PanelLeft size={20} className={`transition-transform duration-200 ${sidebarOpen ? "" : "rotate-180"}`} />
                    </button>

                    {/* Actions and Info */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        {/* Dark Mode Toggle Button */}
                        <button
                            onClick={toggle}
                            className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-app-bg rounded-xl transition-colors cursor-pointer border border-border-subtle/80 shadow-xs"
                            title={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
                        >
                            {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
                        </button>

                        {/* Today's Date Info */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-app-bg rounded-xl text-xs font-semibold text-text-secondary border border-border-subtle/80">
                            <Calendar size={14} className="text-emerald-600" />
                            <span className="hidden sm:inline">
                                {currentDate || "Memuat tanggal..."}
                            </span>
                            <span className="sm:hidden">
                                {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-app-bg p-4 lg:p-8 w-full">
                    <div className="mx-auto container h-full">
                        {children}
                    </div>
                </main>

            </div>

        </div>
    );
}


