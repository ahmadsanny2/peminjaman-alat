const ConfirmationModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Konfirmasi",
    color = "indigo",
}) => {
    if (!isOpen) return null;

    const colorVariants = {
        rose: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
        emerald: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
        indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
        blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in duration-200">
                <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                        {title}
                    </h3>
                    <div className="mt-3">
                        <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`inline-flex justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorVariants[color] || colorVariants.indigo} cursor-pointer`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
