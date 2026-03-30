const HeaderPage = ({ title, icon }) => {
    return (
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            {icon}
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
        </div>
    )
}

export default HeaderPage