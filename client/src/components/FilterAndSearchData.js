import { useTool } from "@/hooks/admin/useToolManagement";
import { Filter, Search, Plus } from "lucide-react";


export default function FilterAndSearchData({ search, sort, isShowForm, placeHolderName, isCategory, showByCategory }) {
    const { categories } = useTool()

    return (
        <form className="flex flex-col md:flex-row justify-between gap-2 z-0">
            <div className="flex bg-white/15 items-center backdrop-blur-2xl rounded-2xl">

                <div className="px-3 py-2">
                    <Filter />
                </div>

                <div className="border-l border-l-slate-600 px-3 py-2">
                    <select
                        className="outline-none cursor-pointer"
                        onChange={sort}
                    >
                        <option className="bg-white/20 text-black" value="">
                            Urutkan
                        </option>
                        <option className="bg-white/20 text-black" value="newest">
                            Terbaru
                        </option>
                        <option className="bg-white/20 text-black" value="oldest">
                            Terlama
                        </option>
                    </select>
                </div>


                {isCategory ? (
                    <div className="border-l border-l-slate-600 px-3 py-2 w-full">
                        <select
                            className="outline-none cursor-pointer w-full"
                            onChange={showByCategory}
                        >
                            <option className="bg-white/20 text-black" value="" disabled>
                                Kategori
                            </option>
                            <option className="bg-white/20 text-black" value="">
                                Semua
                            </option>
                            {categories.map((cat) => (
                                <option className="bg-white/20 text-black" value={cat.name} key={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                ) : (
                    null
                )}
            </div>

            <div className="flex">
                <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-l-2xl w-full">
                    <Search />
                    <input
                        type="text"
                        className="outline-none focus:border-b w-full"
                        onChange={search}
                        placeholder={placeHolderName}
                    />
                </div>

                <div
                    className="bg-blue-500 p-2 cursor-pointer max-w-fit rounded-r-2xl"
                    onClick={isShowForm}
                >
                    <Plus />
                </div>
            </div>
        </form>
    )
}