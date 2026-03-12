import type { DailyReportResponse } from "@/core/types/report";
import { formatNumber } from "@/core/utils/formatters";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";
import { createReportRow } from "./report-row-helpers";

function buildDailyMetricRow(
	key: string,
	label: string,
	amount: string,
	metricKey: string,
	no: string | number = "",
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
		),
		buildDailyMetricRow(
			"daily-premium-ice-sale-cash",
			"Premium Ice sale cash",
			formatNumber(report?.premiumIceSaleCash ?? 0),
			"daily-premium-ice-sale-cash",
		),
		buildDailyMetricRow(
			"daily-customer-sale-invoice-premium-ice",
			"customer sale invoice Premium Ice",
			formatNumber(report?.customerSaleInvoicePremiumIce ?? 0),
			"daily-customer-sale-invoice-premium-ice",
		),
		buildDailyMetricRow(
			"daily-customer-sale-invoice-ice-cube",
			"Customer sale invoice ice cube",
			formatNumber(report?.customerSaleInvoiceIceCube ?? 0),
			"daily-customer-sale-invoice-ice-cube",
		),
	];
	const summaryRows: ReportTemplateRow[] = [
		buildDailyMetricRow(
			"daily-total-revenue",
			"Total Revenues",
			formatNumber(report?.totalRevenue ?? 0),
			"daily-total-revenue",
		),
		buildDailyMetricRow(
			"daily-cash-received",
			"Daily Cash receive",
			formatNumber(report?.totalCashReceive ?? 0),
			"daily-cash-receive",
		),
		buildDailyMetricRow("daily-expense-section", "Daily expenses", "", "daily-expense-section"),
	];
	const expenseRows = boughtItems.map((item, index) =>
		buildDailyMetricRow(
			`daily-expense-item-${index}`,
			item.itemName?.trim() || `Expense item ${index + 1}`,
			formatNumber(item.expense ?? 0),
			`daily-expense-item-${index}`,
			index + 1,
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
		),
	];
}
