"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useTool(page = 1, limit = 10) {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        stock: "",
        categoryId: "",
        image: null
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Sorting Data
    const [sort, setSort] = useState("")

    // Search Data
    const [search, setSearch] = useState("")

    // Show Form
    const [showForm, setShowForm] = useState(false)

    const [showToolByCategory, setShowToolByCategory] = useState("")

    // Fetch Data From Server
    const fetchTools = useCallback(async () => {
        try {
            const [toolsRes, categoriesRes] = await Promise.all([
                api.get(`/tools`, { params: { search, sort, category: showToolByCategory, page, limit } }),
                api.get('/categories')
            ])

            const tools = toolsRes.data.data
            const categories = categoriesRes.data.data

            setTotalPages(toolsRes.data.totalPages || 1)
            setTotalItems(toolsRes.data.totalItems || 0)

            setTools(tools)
            setCategories(categories)
        } catch (error) {
            setError("Gagal mengambil data kategori atau alat di server.")
        }
    }, [page, limit, search, sort, showToolByCategory])

    useEffect(() => {
        fetchTools()
    }, [fetchTools]);

    const handleShowForm = () => {
        setShowForm(!showForm)
    }

    // Handle Change Form
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            setFormData((prev) => ({
                ...prev,
                image: files[0]
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "stock" ? Number(value) : value,
            }));
        }

    };

    // Handle Reset Form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            stock: "",
            categoryId: "",
            image: null
        });
        setIsEditing(false);
        setEditId(null);
        setShowForm(false)
    };

    // Handle Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.categoryId) {
            return alert("Nama, deskripsi dan kategori wajib diisi");
        }

        setIsSubmitting(true);

        const url = isEditing ? `/tools/${editId}` : `/tools`;
        const method = isEditing ? "put" : "post";

        try {
            const data = new FormData()

            data.append("name", formData.name)
            data.append("description", formData.description)
            data.append("stock", formData.stock)
            data.append("categoryId", formData.categoryId)

            if (formData.image) {
                data.append("image", formData.image)
            }

            await api({
                method,
                url,
                data,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            resetForm();
            fetchTools();
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan tool! Coba lagi ya.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Edit Form
    const handleEdit = (tool) => {
        setFormData({
            name: tool.name,
            description: tool.description,
            stock: tool.stock,
            categoryId: tool.categoryId,
            image: null
        });
        setIsEditing(true);
        setEditId(tool.id);
        setShowForm(true)
    };

    // Handle Delete Form
    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus tool ini?")) return;

        try {
            await api.delete(`/tools/${id}`);
            fetchTools();
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus tool! Coba lagi ya.");
        }
    };

    return {
        tools,
        categories,
        formData,
        isEditing,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        resetForm,
        totalPages,
        totalItems,
        setSort,
        setSearch,
        handleShowForm,
        showForm,
        setShowToolByCategory
    };
}
