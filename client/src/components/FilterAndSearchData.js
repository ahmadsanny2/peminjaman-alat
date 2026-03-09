import { useActivityLog } from "@/hooks/admin/useActivityLog";
import { useTool } from "@/hooks/admin/useToolManagement";
import { Filter, Search, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function FilterAndSearchData({
    sort,
    showByCategory,
    showByRole,
    showByActivity,
    hiddenFilterCategory,
    hiddenFilterRole,
    hiddenFilterActivity,
    isShowForm,
    hiddenButtonAddData,
    hiddenSearchData,
    search,
    placeHolderName
}) {

    const searchParams = useSearchParams()

    const { categories } = useTool();
    const { dataActivity } = useActivityLog()

    const userRole = ["Admin", "Petugas", "Peminjam"]

    return (
        <form className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 z-0 space-y-6">
            <div className="flex items-center gap-2">
                <Filter />
                <h1 className="text-xl font-semibold">Filter</h1>
            </div>
            <div className="grid grid-cols-2 gap-4">

                <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl max-md:col-span-2">
                    <select className="outline-none cursor-pointer w-full" onChange={sort}>
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

                {hiddenFilterCategory ? (
                    <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl max-md:col-span-2">
                        <select
                            className="outline-none cursor-pointer w-full"
                            onChange={showByCategory}
                        >
                            <option className="bg-white/20 text-black" value="">
                                Semua
                            </option>
                            {categories.map((cat) => (
                                <option
                                    className="bg-white/20 text-black"
                                    value={cat.name}
                                    key={cat.id}
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}


                {hiddenFilterRole ? (
                    <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl max-md:col-span-2">
                        <select
                            className="outline-none cursor-pointer w-full"
                            onChange={showByRole}
                        >
                            <option className="bg-white/20 text-black" value="">
                                Semua
                            </option>
                            {userRole.map((role, index) => (
                                <option
                                    className="bg-white/20 text-black"
                                    value={role}
                                    key={index}
                                >
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}


                {hiddenFilterActivity ? (
                    <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl max-md:col-span-2">
                        <select
                            className="outline-none cursor-pointer w-full"
                            onChange={showByActivity}
                        >
                            <option className="bg-white/20 text-black" value="">
                                Semua
                            </option>
                            {dataActivity.map((action) => (
                                <option
                                    className="bg-white/20 text-black"
                                    value={action}
                                    key={action}
                                >
                                    {action}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}


                {hiddenSearchData ? (
                    <div className={`flex ${(hiddenFilterCategory || hiddenFilterRole || hiddenFilterActivity) ? "col-span-2" : ""} max-md:col-span-2`}>
                        <div className={`flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 ${hiddenButtonAddData ? "rounded-l-2xl" : "rounded-2xl"} w-full`}>
                            <Search />
                            <input
                                type="text"
                                className="outline-none focus:border-b w-full"
                                onChange={search}
                                placeholder={placeHolderName}
                                defaultValue={searchParams.get('search')?.toString()}
                            />
                        </div>

                        {hiddenButtonAddData ? (
                            <div className="bg-blue-500 p-2 cursor-pointer max-w-fit rounded-r-2xl"
                                onClick={isShowForm}
                            >
                                <Plus />
                            </div>
                        ) : null}

                    </div>
                ) : null}

            </div>
        </form>
    );
}
