import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

const ALERT_VARIANTS = {
    success: {
        container: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="text-green-500" size={18} />,
    },
    error: {
        container: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertCircle className="text-red-500" size={18} />,
    },
    warning: {
        container: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <AlertTriangle className="text-yellow-500" size={18} />,
    },
    info: {
        container: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Info className="text-blue-500" size={18} />,
    },
};

const Alert = ({ type = "info", message, onClose, className = "" }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const variant = ALERT_VARIANTS[type] || ALERT_VARIANTS.info;

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    return (
        <div
            className={`p-4 rounded-lg border text-sm flex justify-between items-start gap-3 transition-all ${variant.container} ${className}`}
            role="alert"
        >
            <div className="flex items-center gap-3">
                <div className="shrink-0">{variant.icon}</div>
                <p className="leading-relaxed">{message}</p>
            </div>

            <button
                onClick={handleClose}
                className="shrink-0 hover:opacity-70 transition-opacity"
                aria-label="Close alert"
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Alert;