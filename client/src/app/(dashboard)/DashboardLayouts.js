"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Calendar, PanelLeft, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }) {
    const { sidebar, setSidebar } = useSidebar();
    const { isDark, toggle } = useDarkMode();
    const [currentDate, setCurrentDate] = useState("");

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
        <div className="bg-app-bg text-text-primary flex h-screen overflow-hidden font-sans transition-colors duration-200">

            {/* Sidebar */}
            <Sidebar
                className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
                    sidebar ? "translate-x-0" : "-translate-x-full"
                }`}
            />

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header Topbar */}
                <header className="h-16 bg-card-bg border-b border-border-subtle flex items-center justify-between px-6 shadow-xs z-10">

                    {/* Sidebar Toggle Button */}
                    <button
                        className="p-2 text-text-secondary hover:text-text-primary hover:bg-app-bg rounded-xl transition-colors cursor-pointer"
                        onClick={() => setSidebar(!sidebar)}
                        aria-label="Toggle Sidebar"
                    >
                        <PanelLeft size={20} />
                    </button>

                    {/* Actions and Info */}
                    <div className="flex items-center gap-4">
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
                            <span>
                                {currentDate || "Memuat tanggal..."}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-app-bg p-6 lg:p-8 w-full">
                    <div className="mx-auto container h-full">
                        {children}
                    </div>
                </main>

            </div>

        </div>
    );
}


