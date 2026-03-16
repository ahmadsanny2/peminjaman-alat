import { CheckCircle2, Circle } from "lucide-react";

const RequirementPasswordItem = ({ met, label }) => (
    <div
        className={`flex items-center gap-2 transition-colors ${met ? "text-green-400" : "text-gray-500"}`}
    >
        {met ? <CheckCircle2 size={14} /> : <Circle size={14} />}
        <span className="text-[10px] lg:text-xs">{label}</span>
    </div>
);

export default RequirementPasswordItem