import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";

export const useUserManagement = () => {
    const { search, sort, role, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
    });

    const [showForm, setShowForm] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch Data From Server
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/users`, {
                params: { search, sort, role, page, limit },
            });

            setUsers(response.data.data);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems || 0);

            setError("");
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }, [search, sort, role, page, limit]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleShowForm = () => {
        setShowForm(!showForm);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            fullName: "",
            role: ""
        })
        setIsEditing(false)
        setShowForm(false)
        setEditId(null)
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.role) {
            alert("Semua field harus diisi!");
        }

        setIsSubmitting(true);

        const url = `/users/${editId}`;
        const method = "put";

        try {
            await api({
                method,
                url,
                data: formData,
            });

            resetForm()
            fetchUsers()
        } catch (err) {
            setError(err.response?.data?.message)
            setShowForm(false)
        } finally {
            setIsSubmitting(false)
        }
    };

    const handleEdit = (user) => {
        setFormData({
            fullName: user.fullName || "",
            role: user.role || "",
        });
        setEditId(user.id)
        setIsEditing(true)
        setShowForm(true)
    };

    const handleDelete = async (id) => {
        try {
            if (!confirm("Yakin mau hapus user ini?")) return

            await api.delete(`/users/${id}`)
            fetchUsers()
        } catch (err) {
            setError(err.response?.data?.message)
        }
    }

    return {
        users,
        isLoading,
        isEditing,
        error,
        handleShowForm,
        page,
        limit,
        totalItems,
        totalPages,
        updateFilters,
        handleSearch,
        role,
        handleEdit,
        formData,
        handleChange,
        isSubmitting,
        showForm,
        handleSubmit,
        resetForm,
        handleDelete
    };
};
