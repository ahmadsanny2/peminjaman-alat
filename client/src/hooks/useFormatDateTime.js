export function useFormatDateTime() {

    const formatDateTime = (dateString, showTime = true) => {
        if (!dateString) return "-"

        const options = {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }

        if (showTime) {
            options.hour = "2-digit"
            options.minute = "2-digit"
            options.second = "2-digit"
        }


        return new Date(dateString).toLocaleString("id-ID", options);
    };
    return {
        formatDateTime
    }
}