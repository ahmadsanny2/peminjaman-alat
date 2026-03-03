import {
    Users,
    SquareArrowLeft,
    Archive,
    Activity,
    History,
    UserPlus,
    PackageCheck,
    Undo2,
    List,
    Package,
} from "lucide-react";

const Feature = () => {
    const listFeature = [
        {
            title: "Login & Logout",
            description: "Autentikasi aman dengan sistem role-based access control",
            icon: <SquareArrowLeft />,
            className: " from-[#e0e9ff] to-[#c7d6fe]",
        },
        {
            title: "CRUD User",
            description: "Kelola data pengguna dengan berbagai level akses",
            icon: <Users />,
            className: "from-emerald-100 to-emerald-200",
        },
        {
            title: "CRUD Alat",
            description: "Manajemen inventaris alat dengan detail lengkap",
            icon: <Package />,
            className: "from-blue-100 to-blue-200",
        },
        {
            title: "CRUD Kategori",
            description: "Organisasi alat berdasarkan kategori yang fleksibel",
            icon: <List />,
            className: "from-purple-100 to-purple-200",
        },
        {
            title: "CRUD Peminjaman",
            description: "Proses peminjaman dari pengajuan hingga persetujuan",
            icon: <Archive />,
            className: "from-orange-100 to-orange-200",
        },
        {
            title: "CRUD Pengembalian",
            description: "Kelola pengembalian alat dengan status kondisi",
            icon: <Undo2 />,
            className: "from-teal-100 to-teal-200",
        },
        {
            title: "Log Aktivitas",
            description: "Rekam semua aktivitas untuk audit dan transparansi",
            icon: <Activity />,
            className: "from-rose-100 to-rose-200",
        },
        {
            title: "Persetujuan Peminjaman",
            description: "Sistem approval bertingkat untuk kontrol yang ketat",
            icon: <PackageCheck />,
            className: "from-indigo-100 to-indigo-200",
        },
        {
            title: "Monitoring Pengembalian",
            description: "Pantau jadwal dan status pengembalian real-time",
            icon: <History />,
            className: "from-cyan-100 to-cyan-200",
        },
        {
            title: "Pengajuan Mandiri",
            description: "Peminjam dapat mengajukan permohonan secara mandiri",
            icon: <UserPlus />,
            className: "from-amber-100 to-amber-200",
        },
    ];
    return (
        <section id="fitur" className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                        Fitur Lengkap
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">
                        Fitur Utama Sistem
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Kelola semua aspek peminjaman alat dengan fitur yang komprehensif
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {listFeature.map((feat, index) => {
                        return (
                            <div
                                className="feature-card group bg-white rounded-2xl p-6 border border-gray-100 hover:border-navy-200 hover:shadow-xl transition-all duration-300"
                                key={index}
                            >
                                <div
                                    className={`bg-linear-to-br ${feat.className} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    {feat.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feat.title}
                                </h3>
                                <p className="text-sm text-gray-600">{feat.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Feature;
