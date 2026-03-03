import { ShieldCheck, X, AlertTriangle, Check } from "lucide-react";

const Why = () => {
    return (
        <section id="tentang" className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 bg-[#e0e9ff] text-[#1e3a5f] rounded-full text-sm font-semibold mb-4">
                        Mengapa PinjamKu?
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
                        Transformasi Pengelolaan Peminjaman
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Dari sistem manual yang rumit menuju pengelolaan digital yang
                        efisien
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fade-in-up">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                                <AlertTriangle size={30} />
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                                    Masalah
                                </span>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Sistem Manual Tradisional
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-2xl">
                                <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <X color="red" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Proses Manual Tidak Efisien
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Pencatatan dengan kertas rentan hilang dan memakan waktu
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-2xl">
                                <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <X color="red" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Data Tidak Terkelola
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Sulit melacak riwayat dan status peminjaman alat
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-2xl">
                                <div className="w-8 h-8 bg-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <X color="red" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">
                                        Minim Transparansi
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Tidak ada audit trail dan akuntabilitas yang jelas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-[#1e3a5f] to-[#0f172a] rounded-3xl p-8 shadow-lg animate-fade-in-up animation-delay-200">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <p className="text-emerald-500">
                                    <ShieldCheck size={30} />
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                    Solusi
                                </span>
                                <h3 className="text-xl font-bold text-white">
                                    PinjamKu Platform
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check color="white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">
                                        Sistem Berbasis Role
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        3 level akses: Admin, Petugas, dan Peminjam dengan hak akses
                                        berbeda
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check color="white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">
                                        Monitoring Real-time
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        Pantau status alat dan peminjaman secara langsung dari
                                        dashboard
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check color="white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">
                                        Log Aktivitas Otomatis
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                        Rekam jejak digital untuk transparansi dan akuntabilitas
                                        penuh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Why;
