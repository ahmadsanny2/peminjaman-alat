import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import { useFilterAndSearchData } from "../useFilterAndSearchData";
import { useConfirm } from "../useConfirm";

export function useCategory() {
    const { search, sort, page, limit, updateFilters, handleSearch } =
        useFilterAndSearchData();

    const { confirmState, ask, close } = useConfirm();

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Show Form
    const [showForm, setShowForm] = useState(false);

    // Fetch Data From Server
    const fetchCategories = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await api.get(`/categories`, {
                params: { search, sort, page, limit },
            });

            setCategories(response.data.data);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems || 0);
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, sort, search]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleShowForm = () => {
        setShowForm(!showForm);
    };

    // Handle Change Form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Reset Form
    const resetForm = () => {
        setFormData({ name: "", description: "" });
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    // Handle Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return alert("Nama kategori wajib diisi");

        setIsLoading(true);
        const url = isEditing ? `/categories/${editId}` : `/categories`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await api({ method, url, data: formData });
            resetForm();
            fetchCategories();
            setError("");

            setSuccess(response?.data?.message);
        } catch (err) {
            setError(err.response?.data?.message);
            resetForm();
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Edit Form
    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setIsEditing(true);
        setEditId(category.id);
        setShowForm(true);
    };

    // Handle Delete Form
    const handleDelete = async (id) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            fetchCategories();

            setSuccess(response?.data?.message);
        } catch (err) {
            setError(err.response?.data?.message);
        }
    };

    return {
        categories,
        totalPages,
        totalItems,
        formData,
        isEditing,
        error,
        isLoading,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        handleShowForm,
        showForm,
        page,
        limit,
        updateFilters,
        handleSearch,
        success,
        confirmState,
        ask,
        close,
    };
}
