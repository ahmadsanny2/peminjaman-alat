import { useActivityLog } from "@/hooks/admin/useActivityLog";
import { useTool } from "@/hooks/admin/useToolManagement";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { Filter, Search, Plus } from "lucide-react";

export default function FilterAndSearchData({
    search,
    sort,
    isShowForm,
    placeHolderName,
    isCategory,
    showByCategory,
    hidden,
    isRole,
    showByRole,
    showByActivity,
    isLogActivity
}) {

    const { categories } = useTool();
    const { users } = useUserManagement()
    const { logs } = useActivityLog()

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

                {isCategory ? (
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

                {isRole ? (
                    <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl max-md:col-span-2">
                        <select
                            className="outline-none cursor-pointer w-full"
                            onChange={showByRole}
                        >
                            <option className="bg-white/20 text-black" value="">
                                Semua
                            </option>
                            {users.map((user) => (
                                <option
                                    className="bg-white/20 text-black"
                                    value={user.role}
                                    key={user.id}
                                >
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}

                {isLogActivity ? (
                    <div className="flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 rounded-2xl max-md:col-span-2">
                        <select
                            className="outline-none cursor-pointer w-full"
                            onChange={showByActivity}
                        >
                            <option className="bg-white/20 text-black" value="">
                                Semua
                            </option>
                            {logs.map((log, index) => (
                                <option
                                    className="bg-white/20 text-black"
                                    value={log.action}
                                    key={index}
                                >
                                    {log.action}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : null}

                <div className={`flex ${(isCategory || isRole || isLogActivity) ? "col-span-2" : ""} max-md:col-span-2`}>
                    <div className={`flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 ${!hidden ? "rounded-l-2xl" : "rounded-2xl"} w-full`}>
                        <Search />
                        <input
                            type="text"
                            className="outline-none focus:border-b w-full"
                            onChange={search}
                            placeholder={placeHolderName}
                        />
                    </div>


                    {!hidden ? (
                        <div
                            className="bg-blue-500 p-2 cursor-pointer max-w-fit rounded-r-2xl"
                            onClick={isShowForm}
                        >
                            <Plus />
                        </div>
                    ) : null}

                </div>
            </div>
        </form>
    );
}
