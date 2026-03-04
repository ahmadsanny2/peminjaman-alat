import { useState, useEffect } from "react";
import api from "@/lib/api";

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    // Fetch Data From Server
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/users");
            setUsers(response.data.data);
            setError("");
        } catch (error) {
            setError("Gagal mengambil data pengguna dari server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle Update Role Form
    const updateRole = async (userId, newRole) => {
        if (
            !window.confirm(
                `Apakah Anda yakin ingin ubah role pengguna ini menjadi: ${newRole.toUpperCase()}?`,
            )
        )
            return;

        setIsUpdating(true);
        setError("");
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            await fetchUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Terjadi anomali saat memodifikasi hak akses pengguna.",
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return {
        users,
        isLoading,
        isUpdating,
        error,
        updateRole,
    };
};
