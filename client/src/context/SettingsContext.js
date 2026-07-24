"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const backendUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
    : "http://localhost:5000";

const SettingsContext = createContext({
    settings: {
        siteName: "Pinjamku",
        siteLogo: "",
        landingTitle: "Sistem Peminjaman Alat Digital yang Terstruktur dan Transparan",
        landingSubtitle: "Platform modern dengan sistem 3 level pengguna yang memudahkan pengelolaan, monitoring, dan pelaporan peminjaman alat secara real-time.",
        landingDescription: "Website ini digunakan untuk mencatat dan mengelola seluruh proses peminjaman dan pengembalian alat secara real-time.",
    },
    refreshSettings: () => {},
    isLoading: false,
    backendUrl,
    getLogoUrl: () => null
});

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        siteName: "Pinjamku",
        siteLogo: "",
        landingTitle: "Sistem Peminjaman Alat Digital yang Terstruktur dan Transparan",
        landingSubtitle: "Platform modern dengan sistem 3 level pengguna yang memudahkan pengelolaan, monitoring, dan pelaporan peminjaman alat secara real-time.",
        landingDescription: "Website ini digunakan untuk mencatat dan mengelola seluruh proses peminjaman dan pengembalian alat secara real-time.",
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await api.get("/settings");
            if (res.data) {
                setSettings(res.data);
            }
        } catch (err) {
            console.error("Failed to load settings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const getLogoUrl = (logoPath) => {
        if (!logoPath) return null;
        if (logoPath.startsWith("http")) return logoPath;
        return `${backendUrl}${logoPath}`;
    };

    return (
        <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, isLoading, backendUrl, getLogoUrl }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
