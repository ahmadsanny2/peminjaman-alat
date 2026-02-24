"use client"

import { useState } from "react";

export function useSidebar() {
    const [sidebar, setSidebar] = useState(false);

    return { sidebar, setSidebar };
}
