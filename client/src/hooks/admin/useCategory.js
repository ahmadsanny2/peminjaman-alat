"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useCategory() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

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
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ name: "", description: "" });
        setIsEditing(false);
        setEditId(null);
    };

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
            alert("Gagal menyimpan kategori");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description });
        setIsEditing(true);
        setEditId(category.id);
    };

   
}
