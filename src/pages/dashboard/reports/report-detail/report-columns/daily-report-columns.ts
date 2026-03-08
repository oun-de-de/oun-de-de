import type { ReportTemplateColumn } from "../../components/layout/report-template-table";
import { buildSizedColumns } from "../report-column-helpers";

export function buildDailyReportColumns(): ReportTemplateColumn[] {
	return buildSizedColumns([
		["no", "NO", "w-[4%]", "center"],
		["label", "DESCRIPTION", "w-[58%]"],
		["quantity", "QTY", "w-[16%]", "right"],
		["amount", "AMOUNT", "w-[22%]", "right"],
	]);
}
