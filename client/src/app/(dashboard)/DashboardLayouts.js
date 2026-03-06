"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({ children }) {
    const [sidebar, setSidebar] = useState(false);

    return (
        <div className="bg-slate-900 text-white flex h-screen">

            {/* Sidebar */}
            <Sidebar
                className={`${sidebar ? "lg:hidden max-lg:fixed max-lg:top-0" : "max-lg:hidden"}`}
            />

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-16 bg-slate-900 border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">

                    {/* Sidebar button */}
                    <button
                        className="cursor-pointer"
                        onClick={() => setSidebar(!sidebar)}
                    >
                        <Menu />
                    </button>

                    {/* Date */}
                    <div className="text-sm text-white">
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden bg-slate-900 p-6">
                    <div className="mx-auto max-w-7xl h-full">{children}</div>
                </main>

            </div>

        </div>
    );
}
