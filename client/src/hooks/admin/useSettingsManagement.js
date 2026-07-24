import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export function useSettingsManagement() {
    const { settings, refreshSettings, getLogoUrl } = useSettings();

    const [formData, setFormData] = useState({
        siteName: "",
        landingTitle: "",
        landingSubtitle: "",
        landingDescription: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Populate form data once settings context is loaded
    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || "",
                landingTitle: settings.landingTitle || "",
                landingSubtitle: settings.landingSubtitle || "",
                landingDescription: settings.landingDescription || "",
            });
            if (settings.siteLogo) {
                setPreviewUrl(getLogoUrl(settings.siteLogo));
            }
        }
    }, [settings, getLogoUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = new FormData();
            data.append("siteName", formData.siteName);
            data.append("landingTitle", formData.landingTitle);
            data.append("landingSubtitle", formData.landingSubtitle);
            data.append("landingDescription", formData.landingDescription);

            if (selectedFile) {
                data.append("logo", selectedFile);
            }

            const response = await api.put("/settings", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess(response.data.message || "Pengaturan berhasil diperbarui");
            refreshSettings();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memperbarui pengaturan");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        previewUrl,
        selectedFile,
        isLoading,
        success,
        error,
        handleChange,
        handleFileChange,
        handleSubmit,
    };
}
