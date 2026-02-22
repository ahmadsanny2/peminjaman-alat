"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useTool() {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        stock: "",
        categoryId: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    
    const fetchTools = async () => {
        try {
            const res = await api.get("/tools");
            setTools(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat tools");
        }
    };

    
    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.data);
        } catch (err) {
            console.error(err);
            setError("Gagal memuat kategori");
        }
    };

    useEffect(() => {
        fetchTools();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "stock"
                    ? Number(value)
                    : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            stock: "",
            categoryId: "",
        });
        setIsEditing(false);
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.categoryId) {
            return alert("Nama dan kategori wajib diisi");
        }

        setIsSubmitting(true);

        const url = isEditing ? `/tools/${editId}` : `/tools`;
        const method = isEditing ? "put" : "post";

        try {
            await api({
                method,
                url,
                data: formData,
            });

            resetForm();
            fetchTools();
        } catch (err) {
            console.error(err);
            alert("Gagal menyimpan tool");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (tool) => {
        setFormData({
            name: tool.name,
            stock: tool.stock,
            categoryId: tool.categoryId,
        });
        setIsEditing(true);
        setEditId(tool.id);
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
    };
}
