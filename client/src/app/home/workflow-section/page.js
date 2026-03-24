import { workflowList } from "@/constants/workflow"

const Workflow = () => {
    return (
        <section id="cara-kerja" className="py-16 lg:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-2 bg-navy-100 text-navy-800 rounded-full text-sm font-semibold mb-4">Cara Kerja</span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-4">Alur Peminjaman yang Mudah</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">5 langkah sederhana untuk mengelola peminjaman alat</p>
                </div>

                {/* Timeline Desktop  */}
                <div className="">
                    <div className="relative">
                        {/* Line */}
                        <div className="absolute from-[#c7d6fe] via-emerald-300 to-[#c7d6fe] lg:top-16 lg:left-0 lg:right-0 lg:w-full lg:h-1 lg:translate-x-0 lg:bg-linear-to-r">
                        </div>

                        <div className="grid lg:grid-cols-5 gap-8 relative">

                            {workflowList.map((item, index) => (

                                <div className={`max-lg:flex max-lg:gap-5 items-center lg:text-center animate-fade-in-up ${item.animationDelay}`} key={index}>
                                    <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">

                                        <div className={`relative w-28 h-28 bg-linear-to-br ${item.background} rounded-3xl flex items-center justify-center shadow-xl`}>
                                            <span className="text-3xl font-bold text-white">{item.nomor}</span>
                                        </div>
                                    </div>
                                    <div className="">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>


                {/* <div className="lg:hidden space-y-6">
                    <div className="flex items-start space-x-4 animate-fade-in-up">
                        <div className="shrink-0 w-14 h-14 bg-linear-to-br from-navy-800 to-navy-900 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">1</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">Login Sesuai Role</h3>
                            <p className="text-sm text-gray-600">Masuk ke sistem dengan akun sesuai hak akses Anda</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 animate-fade-in-up animation-delay-100">
                        <div className="shrink-0 w-14 h-14 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">2</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">Ajukan Peminjaman</h3>
                            <p className="text-sm text-gray-600">Pilih alat dan ajukan permohonan peminjaman</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 animate-fade-in-up animation-delay-200">
                        <div className="shrink-0 w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">3</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">Verifikasi Petugas</h3>
                            <p className="text-sm text-gray-600">Petugas memvalidasi dan menyetujui peminjaman</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 animate-fade-in-up animation-delay-300">
                        <div className="shrink-0 w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">4</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">Sistem Mencatat</h3>
                            <p className="text-sm text-gray-600">Transaksi tercatat otomatis dalam log sistem</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 animate-fade-in-up animation-delay-400">
                        <div className="shrink-0 w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">5</span>
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900">Monitoring & Laporan</h3>
                            <p className="text-sm text-gray-600">Pantau status dan cetak laporan kapanpun</p>
                        </div>
                    </div>
                </div> */}

            </div>
        </section>
    )
}

export default Workflow