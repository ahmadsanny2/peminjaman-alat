import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useLogout() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        router.push("/login");
    };
    return {
        handleLogout,
        Cookies,
    };
}
