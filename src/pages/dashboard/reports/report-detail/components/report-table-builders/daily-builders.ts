import type { DailyReportResponse } from "@/core/types/report";
import { formatNumber } from "@/core/utils/formatters";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";
import { createReportRow } from "./report-row-helpers";

function buildDailyMetricRow(
	key: string,
	label: string,
	amount: string,
	metricKey: string,
	no: string | number,
	quantity = "",
): ReportTemplateRow {
	return createReportRow(key, {
		no,
		label,
		quantity,
		amount,
		metricKey,
	});
}

export function buildApiDailyReportRows(report: DailyReportResponse | undefined): ReportTemplateRow[] {
	const boughtItems = report?.boughtItems ?? [];
	const revenueBreakdownRows: ReportTemplateRow[] = [
		buildDailyMetricRow(
			"daily-ice-cube-sale-cash",
			"Ice cube sale cash",
			formatNumber(report?.iceCubeSaleCash ?? 0),
			"daily-ice-cube-sale-cash",
			1,
		),
		buildDailyMetricRow(
			"daily-premium-ice-sale-cash",
			"Premium Ice sale cash",
			formatNumber(report?.premiumIceSaleCash ?? 0),
			"daily-premium-ice-sale-cash",
			2,
		),
		buildDailyMetricRow(
			"daily-customer-sale-invoice-premium-ice",
			"customer sale invoice Premium Ice",
			formatNumber(report?.customerSaleInvoicePremiumIce ?? 0),
			"daily-customer-sale-invoice-premium-ice",
			3,
		),
		buildDailyMetricRow(
			"daily-customer-sale-invoice-ice-cube",
			"Customer sale invoice ice cube",
			formatNumber(report?.customerSaleInvoiceIceCube ?? 0),
			"daily-customer-sale-invoice-ice-cube",
			4,
		),
	];
	const summaryRows: ReportTemplateRow[] = [
		buildDailyMetricRow(
			"daily-total-revenue",
			"Total Revenues",
			formatNumber(report?.totalRevenue ?? 0),
			"daily-total-revenue",
			5,
		),
		buildDailyMetricRow(
			"daily-cash-received",
			"Daily Cash receive",
			formatNumber(report?.totalCashReceive ?? 0),
			"daily-cash-receive",
			6,
		),
		buildDailyMetricRow("daily-expense-section", "Daily expenses", "", "daily-expense-section", 7),
	];
	const expenseRows = boughtItems.map((item, index) =>
		buildDailyMetricRow(
			`daily-expense-item-${index}`,
			item.itemName?.trim() || `Expense item ${index + 1}`,
			formatNumber(item.expense ?? 0),
			`daily-expense-item-${index}`,
			index + 8,
		),
	);

	return [
		...revenueBreakdownRows,
		...summaryRows,
		...expenseRows,
		buildDailyMetricRow(
			"daily-expense-total",
			"Total expense",
			formatNumber(report?.totalExpense ?? 0),
			"daily-expense-total",
			expenseRows.length + 8,
		),
	];
}
