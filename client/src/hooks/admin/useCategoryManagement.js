"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useCategory(page = 1, limit = 5) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Sorting Data
    const [sort, setSort] = useState("");

    // Search Data
    const [search, setSearch] = useState("")

    // Show Form
    const [showForm, setShowForm] = useState(false)

    // Fetch Data From Server
    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get(`/categories?search=${search}&sort=${sort}&page=${page}&limit=${limit}`);

            setCategories(response.data.data);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat kategori");
        }
    }, [page, limit, sort, search]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleShowForm = () => {
        setShowForm(!showForm)
    }

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
        setShowForm(false)
    };

    // Handle Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return alert("Nama kategori wajib diisi");

        setIsSubmitting(true);
        const url = isEditing ? `/categories/${editId}` : `/categories`;
        const method = isEditing ? "PUT" : "POST";

        try {
            await api({ method, url, data: formData });
            resetForm();
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan kategori! Coba lagi ya.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit Form
    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setIsEditing(true);
        setEditId(category.id);
        setShowForm(true)
    };

    // Handle Delete Form
    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus kategori ini?")) return;

        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus kategori! Coba lagi ya.");
        }
    };

    return {
        categories,
        totalPages,
        totalItems,
        formData,
        isEditing,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        setSort,
        setSearch,
        handleShowForm,
        showForm
    };
}
