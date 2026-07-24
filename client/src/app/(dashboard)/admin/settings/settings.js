"use client";

import { Settings as SettingsIcon, Image as ImageIcon, Globe, Info } from "lucide-react";
import Image from "next/image";

import Label from "@/components/Form/Label";
import Input from "@/components/Form/Input";
import TextArea from "@/components/Form/TextArea";
import Button from "@/components/Form/Button";
import HeaderPage from "@/components/HeaderPage";
import Alert from "@/components/Alert";
import { useSettingsManagement } from "@/hooks/admin/useSettingsManagement";

export default function SettingsContent() {
    const {
        formData,
        previewUrl,
        isLoading,
        success,
        error,
        handleChange,
        handleFileChange,
        handleSubmit,
    } = useSettingsManagement();

    return (
        <div className="space-y-6">
            {/* Header */}
            <HeaderPage
                icon={<SettingsIcon className="text-emerald-600" size={32} />}
                title="Pengaturan Aplikasi"
            />

            {/* Error/Success Response */}
            {(error || success) && (
                <Alert
                    type={error ? "error" : "success"}
                    message={error || success}
                />
            )}

            {/* Content Container */}
            <div className="bg-card-bg rounded-2xl border border-border-subtle shadow-lg p-6 lg:p-8 transition-colors duration-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Identitas Aplikasi */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle/60">
                            <Globe size={18} className="text-emerald-600" />
                            <h2 className="text-base font-bold text-text-primary">Identitas Aplikasi</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Nama Website */}
                            <div>
                                <Label name="Nama Website" />
                                <Input
                                    type="text"
                                    name="siteName"
                                    value={formData.siteName}
                                    onChange={handleChange}
                                    placeholder="Masukkan Nama Website (contoh: Pinjamku)"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Logo Website */}
                            <div>
                                <Label name="Logo Website" />
                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                    {/* Logo Preview */}
                                    <div className="w-24 h-24 rounded-2xl bg-app-bg flex items-center justify-center overflow-hidden border border-border-subtle shadow-inner">
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Site Logo Preview"
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-contain p-2"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-text-secondary/40">
                                                <ImageIcon size={24} />
                                                <span className="text-[10px]">No Logo</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload File Input */}
                                    <div className="flex-1 w-full">
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-600/10 file:text-emerald-600 dark:file:bg-emerald-600/20 dark:file:text-emerald-400 hover:file:bg-emerald-600/20 transition-all cursor-pointer"
                                            disabled={isLoading}
                                        />
                                        <p className="text-[11px] text-text-secondary/50 mt-1.5">
                                            Format yang diizinkan: PNG, JPG, JPEG, WEBP. Ukuran Maksimum: 2MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Konten Landing Page */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-border-subtle/60">
                            <Info size={18} className="text-emerald-600" />
                            <h2 className="text-base font-bold text-text-primary">Konten Landing Page (Hero)</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Judul Hero */}
                            <div>
                                <Label name="Judul Utama (Title)" />
                                <Input
                                    type="text"
                                    name="landingTitle"
                                    value={formData.landingTitle}
                                    onChange={handleChange}
                                    placeholder="Masukkan judul utama di landing page"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Sub-judul Hero */}
                            <div>
                                <Label name="Sub-judul (Subtitle / Ringkasan)" />
                                <Input
                                    type="text"
                                    name="landingSubtitle"
                                    value={formData.landingSubtitle}
                                    onChange={handleChange}
                                    placeholder="Masukkan sub-judul singkat"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Deskripsi Tambahan */}
                            <div>
                                <Label name="Deskripsi Tambahan (Landing Description)" />
                                <TextArea
                                    name="landingDescription"
                                    value={formData.landingDescription}
                                    onChange={handleChange}
                                    placeholder="Masukkan penjelasan tambahan mengenai website ini..."
                                    rows={4}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-border-subtle/40">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            name={isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
