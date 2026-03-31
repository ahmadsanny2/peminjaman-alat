import LevelUserComponent from "@/components/LevelUser";

const LevelUser = () => {
    return (
        <section
            id="user-role"
            className="py-16 lg:py-24 bg-linear-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 bg-white/10 text-emerald-400 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                        Value Proposition
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Sistem 3 Level Pengguna
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Hak akses yang terstruktur untuk keamanan dan efisiensi operasional
                    </p>
                </div>

                <LevelUserComponent />
            </div>
        </section>
    );
};

export default LevelUser;
