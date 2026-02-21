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

   
}
