import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export const useUserManagement = (page, limit = 10) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    const [showByRole, setShowByRole] = useState("")

    // Fetch Data From Server
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/users?`, { params: { search, sort, role: showByRole, page, limit } });

            setUsers(response.data.data);
            setTotalPages(response.data.totalPages || 1)
            setTotalItems(response.data.totalItems)

            setError("");
        } catch (error) {
            setError("Gagal mengambil data pengguna dari server.");
        } finally {
            setIsLoading(false);
        }
    }, [search, sort, showByRole, page, limit]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleShowForm = () => {
        setShowForm(!showForm);
    };

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
        setSearch,
        handleShowForm,
        setSort,
        totalItems,
        totalPages,
        setShowByRole
    };
};
