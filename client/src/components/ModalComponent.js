export default function Modal({ isOpen, children, customClass }) {
    if (!isOpen) return null;

    return (
        <div className={`bg-black/50 h-full z-10 ${customClass} p-5`}>
            <div className="bg-white text-black rounded-lg shadow-lg w-150 p-6 relative">
                {children}
            </div>
        </div>
    );
}