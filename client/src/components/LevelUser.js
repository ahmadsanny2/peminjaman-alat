import { Check, ShieldCheck, ClipboardCheck, User } from "lucide-react";

const LevelUserComponent = () => {
    const levelUserCard = [
        {
            role: "ADMIN",
            icon: <ShieldCheck className="text-emerald-400" />,
            title: "Full System Control",
            description: "Akses penuh untuk mengelola seluruh sistem dan konfigurasi",
            accessRightList: [
                "Manajemen User & Role",
                "Konfigurasi Sistem",
                "Master Data Management",
                "Log Aktivitas",
                "Laporan Transaksi Peminjaman",
            ],
            borderHover: "hover:border-emerald-400/50",
        },
        {
            role: "PETUGAS",
            icon: <ClipboardCheck className="text-blue-400" />,
            title: "Validasi & Monitoring",
            description: "Mengelola operasional peminjaman dan validasi harian",
            accessRightList: [
                "Validasi Peminjaman",
                "Verifikasi Pengembalian",
                "Monitoring Peminjaman",
            ],
            borderHover: "hover:border-blue-400/50",
        },
        {
            role: "PEMINJAM",
            icon: <User className="text-purple-400" />,
            title: "Self-Service Portal",
            description: "Akses mandiri untuk kebutuhan peminjaman alat",
            accessRightList: [
                "Lihat Katalog Alat",
                "Ajukan Peminjaman",
                "Tracking Status",
                "Riwayat Peminjaman",
            ],
            borderHover: "hover:border-purple-400/50",
        },
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levelUserCard.map((item, index) => {
                let color = "";

                if (item.role === "ADMIN") {
                    color = [
                        {
                            backgroundColorRole: "bg-emerald-500",
                            backgroundColorIcon: "bg-emerald-500/20",
                            checkColor: "text-emerald-400",
                        },
                    ];
                } else if (item.role === "PETUGAS") {
                    color = [
                        {
                            backgroundColorRole: "bg-blue-500",
                            backgroundColorIcon: "bg-blue-500/20",
                            checkColor: "text-blue-400",
                        },
                    ];
                } else {
                    color = [
                        {
                            backgroundColorRole: "bg-purple-500",
                            backgroundColorIcon: "bg-purple-500/20",
                            checkColor: "text-purple-400",
                        },
                    ];
                }
                return (
                    <div
                        className={`group bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 ${item.borderHover} transition-all duration-300 hover:transform hover:-translate-y-2`}
                        key={index}
                    >
                        <div className="flex items-center justify-between mb-6">
                            {color.map((col, i) => (
                                <span
                                    className={`px-4 py-1.5 ${col.backgroundColorRole} text-white text-xs font-bold rounded-full uppercase tracking-wider`}
                                    key={i}
                                >
                                    {item.role}
                                </span>
                            ))}
                            {color.map((col, i) => (
                                <div
                                    className={`w-12 h-12 rounded-2xl ${col.backgroundColorIcon} flex items-center justify-center`}
                                    key={i}
                                >
                                    {item.icon}
                                </div>
                            ))}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                        <p className="text-gray-300 mb-6">{item.description}</p>
                        <ul className="space-y-3">
                            {item.accessRightList.map((listItem, indexList) => (
                                <li
                                    className="flex items-center space-x-3 text-gray-300"
                                    key={indexList}
                                >
                                    {color.map((col, i) => (
                                        <Check key={i} className={col.checkColor} />
                                    ))}
                                    <span>{listItem}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default LevelUserComponent;
