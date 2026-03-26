import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useState } from "react";


const AlertComponent = ({ isSuccess, message }) => {
    const [hidden, setHidden] = useState(false)

    return (
        <div className={`${hidden ? "hidden" : ""}`}>
            <div
                className={` ${isSuccess ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"} p-4 rounded-lg border text-sm flex justify-between`}
            >
                <div className="flex items-center gap-3">
                    {isSuccess ? (
                        <CheckCircle className="mt-0.5 text-green-500" size={18} />
                    ) : (
                        <AlertCircle className="mt-0.5 text-red-500" size={18} />
                    )}
                    <span>{message}</span>
                </div>
                <div className="cursor-pointer" onClick={() => setHidden(!hidden)}>
                    <X />
                </div>
            </div>
        </div>
    );
};

export default AlertComponent;
