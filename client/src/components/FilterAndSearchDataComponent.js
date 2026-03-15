import { useFilterAndSearchData } from "@/hooks/useFilterAndSearchData";
import { Filter, Search, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function FilterAndSearchData({
    sort,
    hiddenFilterCategory,
    hiddenFilterRole,
    hiddenFilterActivity,
    isShowForm,
    hiddenButtonAddData,
    hiddenSearchData,
    search,
    placeHolderName,
    showBy,
    label,
    children,
    hiddenFilterData
}) {

    const { showFilterData, setShowFilterData } = useFilterAndSearchData()

    const searchParams = useSearchParams()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className={`border border-white/15 hover:bg-white/15 ${showFilterData ? "bg-white/15" : ""} transition-all ease-in-out duration-300 flex items-center gap-2 p-2 rounded-2xl cursor-pointer`} onClick={() => setShowFilterData(!showFilterData)}>
                    <Filter size={20} />
                    <h1 className="font-semibold max-md:hidden">Filter</h1>
                </div>

                {/* Input Search and Button Add Data */}
                {hiddenSearchData ? (
                    //  Input Search Data
                    <div className={`flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl w-full`}>
                        <Search />
                        <input
                            type="text"
                            className="outline-none focus:border-b w-full"
                            onChange={search}
                            placeholder={placeHolderName}
                            defaultValue={searchParams.get('search')?.toString()}
                        />
                    </div>
                ) : null}

                {/* Button Add Data */}
                {hiddenButtonAddData ? (
                    <div className="bg-blue-500 p-2 cursor-pointer max-w-fit rounded-2xl"
                        onClick={isShowForm}
                    >
                        <Plus />
                    </div>
                ) : null}
            </div>

            <form className={`space-y-6 ${showFilterData ? "" : "hidden"}`}>

                <div className="flex items-center gap-4">

                    {/* Sort Data */}
                    <div className="flex flex-col space-y-1">
                        <label className="">Urutkan</label>
                        <div className="bg-white/15 backdrop-blur-2xl p-2 rounded-lg">
                            <select className="outline-none cursor-pointer w-full" onChange={sort}>
                                <option className="bg-white/20 text-black" value="ASC">
                                    Ascending
                                </option>
                                <option className="bg-white/20 text-black" value="DESC">
                                    Descending
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Data */}
                    {hiddenFilterData ? (
                        <div className="flex flex-col space-y-1">
                            <label className="">{label}</label>
                            <div className="bg-white/15 backdrop-blur-2xl p-2 rounded-lg">
                                <select
                                    className="outline-none cursor-pointer w-full"
                                    onChange={showBy}
                                >
                                    <option className="bg-white/20 text-black" value="">
                                        Semua
                                    </option>
                                    {children}
                                </select>
                            </div>
                        </div>
                    ) : null}

                </div>
            </form>
        </div>
    );
}
