const HeaderForm = ({ icon, title }) => {
    return (
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-lg font-semibold text-slate-800  flex items-center gap-2">
                {title}
            </h2>
        </div>
    )
}

export default HeaderForm