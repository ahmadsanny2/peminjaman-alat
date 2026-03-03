import { CheckCircle, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

const Hero = () => {
    return (
        <section
            id="hero"
            className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden"
        >
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="text-center lg:text-left animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#1e3a5f] leading-tight mb-6">
                            <p className="">
                                Sistem Peminjaman Alat Digital yang
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1e3a5f] to-emerald-500">
                                    {" "}
                                    Terstruktur
                                </span>{" "}
                                dan{" "}
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-[#1e3a5f]">
                                    Transparan
                                </span>
                            </p>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                            Platform modern dengan sistem 3 level pengguna yang memudahkan
                            pengelolaan, monitoring, dan pelaporan peminjaman alat secara
                            real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/login"
                                className="group px-8 py-4 bg-linear-to-r from-[#1e3a5f] to-[#0f172a] text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-[#1e3a5f]/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                            >
                                <span>Mulai Peminjaman</span>
                                <ArrowRight />
                            </Link>
                        </div>
                    </div>

                    <div className="relative animate-fade-in-up animation-delay-200">
                        <div className="relative">
                            <div className="bg-slate-900 rounded-3xl shadow-2xl shadow-[#1e3a5f]/10 p-6 lg:p-8 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">
                                        Dashboard Peminjam
                                    </span>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-linear-to-br from-[#1e3a5f] to-[#1e3a5f] rounded-2xl p-4 text-white">
                                        <p className="text-xs opacity-80 mb-1">Total Alat</p>
                                        <p className="text-2xl font-bold">248</p>
                                    </div>
                                    <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
                                        <p className="text-xs opacity-80 mb-1">Dipinjam</p>
                                        <p className="text-2xl font-bold">56</p>
                                    </div>
                                    <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
                                        <p className="text-xs opacity-80 mb-1">Tersedia</p>
                                        <p className="text-2xl font-bold">192</p>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
                                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                                        Prosedur Konfigurasi Sistem
                                    </h2>
                                    <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm">
                                        <li>
                                            Konfigurasikan entitas referensi pada menu{" "}
                                            <strong>Manajemen Kategori</strong> terlebih dahulu.
                                        </li>
                                        <li>
                                            Registrasikan spesifikasi fisik barang pada menu{" "}
                                            <strong>Inventaris Alat</strong>.
                                        </li>
                                        <li>
                                            Pantau dan validasi arus keluar-masuk barang melalui menu{" "}
                                            <strong>Rekapitulasi Peminjaman</strong>.
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div className="absolute -top-14 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-[float_3s_ease-in-out_infinite]">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <CheckCircle color="white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">100%</p>
                                        <p className="text-xs text-gray-500">Mudah Digunakan</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-14 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-[float_3s_ease-in-out_infinite]">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-linear-to-br from-[#1e3a5f] to-[#1e3a5f] rounded-xl flex items-center justify-center">
                                        <Users color="white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            3 Roles
                                        </p>
                                        <p className="text-xs text-gray-500">Multi-level Access</p>
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
