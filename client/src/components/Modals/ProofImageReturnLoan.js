import Image from "next/image";
import Modal from "../Modal";
import { Package } from "lucide-react";
import HeaderForm from "../Form/HeaderForm";
import { getImageUrl } from "@/lib/image";

const ProofImageReturnLoan = ({
    showProofModal,
    closeProofModal,
    selectedLoan,
}) => {
    const imageUrl = getImageUrl(selectedLoan?.image);

    return (
        <Modal
            customClass={
                showProofModal
                    ? "fixed inset-0 h-full flex items-center justify-center z-50 bg-black/50 backdrop-blur-xs"
                    : "hidden"
            }
            isOpen={showProofModal}
            onClose={closeProofModal}
        >
            {/* Header */}
            <HeaderForm
                icon={<Package size={24} className="text-emerald-600" />}
                title="Bukti Pengembalian Alat"
                className="border-b border-border-subtle pb-3"
            />

            <div className="space-y-4">
                <div className="relative w-full h-64 bg-app-bg rounded-xl border border-border-subtle overflow-hidden flex items-center justify-center">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={selectedLoan?.Tool?.name || "Bukti"}
                            fill
                            className="object-contain p-2"
                            unoptimized
                        />
                    ) : (
                        <span className="text-sm text-text-secondary/60 font-medium">
                            Visual tidak tersedia
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Nama Alat
                    </label>
                    <input
                        type="text"
                        value={selectedLoan?.Tool?.name || "Instrumen tidak diketahui"}
                        className="w-full p-2.5 border bg-app-bg text-text-secondary font-medium rounded-xl outline-none text-sm border-border-subtle"
                        disabled
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={closeProofModal}
                        className="px-5 py-2.5 bg-card-bg border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-app-bg font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProofImageReturnLoan;
