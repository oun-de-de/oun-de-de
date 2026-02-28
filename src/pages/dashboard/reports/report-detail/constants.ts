import { formatDateToYYYYMMDD, getTodayUTC } from "@/core/utils/date-utils";
import type { ReportColumnVisibility, ReportSectionVisibility } from "../components/layout/report-toolbar";

const today = getTodayUTC();

function formatDateToDDMMYYYY(date: Date): string {
	const day = String(date.getUTCDate()).padStart(2, "0");
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	const year = date.getUTCFullYear();
	return `${day}/${month}/${year}`;
}

export function formatReportTimestamp(employeeName: string, date: Date): string {
	const weekday = new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		timeZone: "UTC",
	}).format(date);
	const time = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		timeZone: "UTC",
	}).format(date);

	return `By ${employeeName}, ${weekday} ${formatDateToDDMMYYYY(date)} ${time}`;
}

export const REPORT_KHMER_TITLE = "ហាងម្រុននីការកក លឹម មុន II";
export const REPORT_ENGLISH_TITLE = "OPEN INVOICE DETAIL BY CUSTOMER";
export const REPORT_DEFAULT_DATE = formatDateToDDMMYYYY(today);
export const REPORT_DEFAULT_DATE_INPUT = formatDateToYYYYMMDD(today);
export const REPORT_FOOTER_TEXT = "";

export const DEFAULT_REPORT_SECTIONS: ReportSectionVisibility = {
	header: true,
	filter: true,
	footer: true,
	timestamp: true,
	signature: false,
};

export const DEFAULT_REPORT_COLUMNS: ReportColumnVisibility = {
	refNo: true,
	category: false,
	geography: true,
	address: true,
	phone: true,
};
