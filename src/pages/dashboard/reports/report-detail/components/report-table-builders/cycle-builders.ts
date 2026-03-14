import type { Cycle } from "@/core/types/cycle";
import { formatFlexibleDisplayDate } from "@/core/utils/date-display";
import { formatKHR } from "@/core/utils/formatters";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";
import { createReportRow } from "./report-row-helpers";

export function buildCycleReportRows(cycles: Cycle[]): ReportTemplateRow[] {
	return cycles.map((cycle) => {
		const startDate = formatFlexibleDisplayDate(cycle.startDate);
		const endDate = formatFlexibleDisplayDate(cycle.endDate);
		const invoiceTotal = cycle.totalAmount ?? 0;
		const paid = cycle.totalPaidAmount ?? 0;
		const outstanding = Math.max(0, invoiceTotal - paid);

		return createReportRow(cycle.id, {
			customer: cycle.customerName ?? "-",
			cycle: `${startDate} - ${endDate}`,
			invoiceTotal: formatKHR(invoiceTotal),
			paid: formatKHR(paid),
			outstanding: formatKHR(outstanding),
		});
	});
}
