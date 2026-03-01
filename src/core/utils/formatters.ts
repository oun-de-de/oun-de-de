import { format, parseISO } from "date-fns";

export function formatNumber(value?: number | null, fallback = "0"): string {
	if (typeof value !== "number" || Number.isNaN(value)) return fallback;
	return value.toLocaleString();
}

export function formatKHR(value?: number | null, fallback = "0 KHR"): string {
	if (typeof value !== "number" || Number.isNaN(value)) return fallback;
	return `${value.toLocaleString()} KHR`;
}

export function formatDisplayDate(value?: string | null, fallback = "-"): string {
	if (!value) return fallback;
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return fallback;
	return parsed.toLocaleDateString("en-GB"); // dd/MM/yyyy format typically
}

export function formatDisplayDateTime(value?: string | null, fallback = "-"): string {
	if (!value) return fallback;
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return fallback;
	return parsed.toLocaleString("en-GB"); // dd/MM/yyyy HH:mm:ss
}

export function formatDateTime(value?: string | null, fallback = "-"): string {
	if (!value) return fallback;
	try {
		// use date-fns for consistency in some places
		return format(parseISO(value), "dd/MM/yyyy HH:mm");
	} catch {
		return fallback;
	}
}
