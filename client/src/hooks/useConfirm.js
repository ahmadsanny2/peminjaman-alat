// hooks/useConfirm.js
import { useState } from "react";

export function useConfirm() {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: "",
        message: "",
        color: "indigo",
        confirmText: "Ya, Lanjutkan",
        onConfirm: () => {},
    });

    // Fungsi utama untuk memicu modal
    const ask = (config) => {
        setConfirmState({
            isOpen: true,
            title: config.title || "Konfirmasi",
            message: config.message || "Apakah Anda yakin?",
            color: config.color || "indigo",
            confirmText: config.confirmText || "Ya, Lanjutkan",
            onConfirm: async () => {
                await config.action(); // Eksekusi fungsi (misal: deleteApi)
                close();               // Tutup modal setelah sukses
            },
        });
    };

    const close = () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
    };

    return {
        confirmState,
        ask,
        close,
    };
}