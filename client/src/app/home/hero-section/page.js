"use client";

import { CheckCircle, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

const Hero = () => {
    const { settings } = useSettings();
    return (
        <section
            id="hero"
            className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden bg-app-bg text-text-primary transition-colors duration-200"
        >
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight mb-6 tracking-tight">
                            {settings.landingTitle}
                        </h1>
                        <p className="text-lg lg:text-xl text-text-secondary mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            {settings.landingSubtitle}
                        </p>
                        {settings.landingDescription && (
                            <p className="text-sm text-text-secondary/70 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                {settings.landingDescription}
                            </p>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/login"
                                className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-xl shadow-emerald-600/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2.5"
                            >
                                <span>Mulai Peminjaman</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative animate-fade-in-up animation-delay-200 max-md:my-10">
                        <div className="relative">
                            {/* Dashboard Mockup Card */}
                            <div className="bg-card-bg rounded-3xl shadow-2xl p-6 lg:p-8 border border-border-subtle">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    </div>
                                    <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
                                        Dashboard Peminjam
                                    </span>
                                </div>

                                {/* Mockup Stats Grid */}
                                <div className="grid grid-cols-3 gap-3.5 mb-6">
                                    <div className="bg-app-bg rounded-2xl p-4 border border-border-subtle">
                                        <p className="text-xs text-text-secondary mb-1 font-medium">Alat Tersedia</p>
                                        <p className="text-2xl font-bold text-text-primary">248</p>
                                    </div>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1 font-medium">Menunggu</p>
                                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">56</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">Dipinjam</p>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">192</p>
                                    </div>
                                </div>

                                {/* Mockup Action Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-app-bg p-5 rounded-2xl border border-border-subtle shadow-xs">
                                        <h2 className="text-base font-bold text-text-primary mb-1.5">
                                            Eksplorasi Katalog
                                        </h2>
                                        <p className="text-text-secondary text-xs mb-3 leading-relaxed">
                                            Tinjau spesifikasi dan ketersediaan stok instrumen fisik yang
                                            diregistrasikan untuk kebutuhan Anda.
                                        </p>
                                        <Link
                                            href="/borrower/tools-catalog"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            <span>Buka Katalog Alat</span> <ArrowRight size={14} />
                                        </Link>
                                    </div>

                                    <div className="bg-app-bg p-5 rounded-2xl border border-border-subtle shadow-xs">
                                        <h2 className="text-base font-bold text-text-primary mb-1.5">
                                            Pantau Transaksi
                                        </h2>
                                        <p className="text-text-secondary text-xs mb-3 leading-relaxed">
                                            Verifikasi persetujuan dari petugas dan pastikan Anda mengembalikan
                                            sesuai tenggat waktu.
                                        </p>
                                        <Link
                                            href="/borrower/transactions-history"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                                        >
                                            <span>Lihat Riwayat</span> <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge 1 */}
                            <div className="absolute -top-6 -right-3 bg-card-bg rounded-2xl shadow-xl p-3.5 border border-border-subtle animate-[float_3s_ease-in-out_infinite]">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                                        <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary">100%</p>
                                        <p className="text-[11px] text-text-secondary">Mudah Digunakan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge 2 */}
                            <div className="absolute -bottom-6 -left-3 bg-card-bg rounded-2xl shadow-xl p-3.5 border border-border-subtle animate-[float_3s_ease-in-out_infinite]">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                        <Users className="text-blue-600 dark:text-blue-400" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary">3 Roles</p>
                                        <p className="text-[11px] text-text-secondary">Multi-level Access</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
