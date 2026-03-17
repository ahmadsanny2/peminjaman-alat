import { useState } from "react";

export function useShowForm() {
    // Show Form
    const [showForm, setShowForm] = useState(false);

    const handleShowForm = () => {
        setShowForm(!showForm);
    };

    return {
        handleShowForm, showForm, setShowForm
    }
}