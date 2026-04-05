import Image from "next/image";
import Modal from "../Modal";
import { Package } from "lucide-react";
import HeaderForm from "../Form/HeaderForm";

const ProofImageReturnLoan = ({
    showProofModal,
    closeProofModal,
    selectedLoan,
}) => {
    return (
        <Modal
            customClass={
                showProofModal
                    ? "fixed inset-0 h-full flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
                    : "hidden"
            }
            isOpen={showProofModal}
            onClose={closeProofModal}
        >
            {/* Header */}
            <HeaderForm
                icon={<Package size={24} className="text-blue-600" />}
                title="Bukti Pengembalian Alat"
                className="border-b pb-3"
            />

            <div className="space-y-4">
                <div className="relative w-full h-64 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                    {selectedLoan.image ? (
                        <Image
                            src={`http://localhost:5000/${selectedLoan.image.replace(/^\//, "")}`}
                            alt={selectedLoan.Tool?.name || "Bukti"}
                            fill
                            className="object-contain p-2"
                            unoptimized
                        />
                    ) : (
                        <span className="text-sm text-slate-400 font-medium">
                            Visual tidak tersedia
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Nama Alat
                    </label>
                    <input
                        type="text"
                        value={selectedLoan.Tool?.name || "Instrumen tidak diketahui"}
                        className="w-full p-2.5 border bg-slate-50 text-slate-600 font-medium rounded-lg outline-none text-sm border-slate-300"
                        disabled
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={closeProofModal}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm rounded-lg transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProofImageReturnLoan;
