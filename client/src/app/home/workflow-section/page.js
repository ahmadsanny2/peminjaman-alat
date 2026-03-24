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

            </div>
        </section>
    )
}

export default Workflow