import { Plus, Search } from "lucide-react"

import { useSearchParams } from "next/navigation"

const SearchComponent = ({ hiddenFilterCategory,
    hiddenFilterRole,
    hiddenFilterActivity,
    isShowForm,
    hiddenButtonAddData,
    hiddenSearchData,
    search,
    placeholderName, }) => {
        
    const searchParams = useSearchParams()

    return (
        <div className="">
            {/* Input Search and Button Add Data */}
            {hiddenSearchData ? (
                <div className={`flex ${(hiddenFilterCategory || hiddenFilterRole || hiddenFilterActivity) ? "col-span-2" : ""} `}>

                    {/* Input Search Data */}
                    <div className={`flex items-center bg-white/15 backdrop-blur-2xl p-2 gap-2 ${hiddenButtonAddData ? "rounded-l-2xl" : "rounded-2xl"} w-full`}>
                        <Search />
                        <input
                            type="text"
                            className="outline-none focus:border-b w-full"
                            onChange={search}
                            placeholder={placeholderName}
                            defaultValue={searchParams.get('search')?.toString()}
                        />
                    </div>

                    {/* Button Add Data */}
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
    )
}