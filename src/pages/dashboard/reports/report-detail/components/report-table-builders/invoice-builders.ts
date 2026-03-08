import { accountingRows } from "@/_mock/data/dashboard";
import type { Invoice, InvoiceExportLineResult, InvoiceExportPreviewRow } from "@/core/types/invoice";
import type { DailyReportResponse } from "@/core/types/report";
import { formatDisplayDate, formatNumber } from "@/core/utils/formatters";
import {
	buildReportRows as buildExportReportRows,
	mapExportLineToPreviewRow,
	resolveBalance,
	resolveOriginalAmount,
} from "../../../../invoice/export-preview/utils/export-preview-rows";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";

const PREMIUM_PRODUCT_KEYWORDS = ["premium", "solid ice", "អនាម័យ"] as const;
const ICE_CUBE_KEYWORDS = ["cube", "ដើម"] as const;

export function mapExportLinesToPreviewRows(exportLines: InvoiceExportLineResult[]): InvoiceExportPreviewRow[] {
	return exportLines.map(mapExportLineToPreviewRow);
}

export function buildInvoiceReportRows(exportLines: InvoiceExportLineResult[]): ReportTemplateRow[] {
	return buildExportReportRows(mapExportLinesToPreviewRows(exportLines));
}

function groupPreviewRowsByRefNo(previewRows: InvoiceExportPreviewRow[]): Map<string, InvoiceExportPreviewRow[]> {
	const previewByRefNo = new Map<string, InvoiceExportPreviewRow[]>();

	for (const previewRow of previewRows) {
		const key = previewRow.refNo || "";
		const current = previewByRefNo.get(key) ?? [];
		current.push(previewRow);
		previewByRefNo.set(key, current);
	}

	return previewByRefNo;
}

function getNotificationText(amount: number): string {
	if (amount >= 2_000_000) return "Truck credit limit alert";
	if (amount >= 1_000_000) return "Tuk-tuk credit limit alert";
	return "-";
}

function sumOriginalAmount(rows: InvoiceExportPreviewRow[]): number {
	return rows.reduce((sum, row) => sum + (resolveOriginalAmount(row) ?? 0), 0);
}

function sumPaid(rows: InvoiceExportPreviewRow[]): number {
	return rows.reduce((sum, row) => sum + (row.paid ?? 0), 0);
}

function getInvoicePaid(rows: InvoiceExportPreviewRow[]): number {
	const paidValues = rows.map((row) => row.paid ?? 0).filter((value) => value > 0);
	if (paidValues.length === 0) return 0;
	return Math.max(...paidValues);
}

function getInvoiceBalance(rows: InvoiceExportPreviewRow[], originalAmount: number, received: number): number {
	const balanceValues = rows
		.map((row) => resolveBalance(row, resolveOriginalAmount(row)))
		.filter((value): value is number => value != null && value >= 0);

	if (balanceValues.length > 0) {
		return Math.min(...balanceValues);
	}

	return Math.max(originalAmount - received, 0);
}

function getOpenInvoiceMetrics(
	invoice: Pick<Invoice, "refNo" | "amount">,
	rowsByRefNo: Map<string, InvoiceExportPreviewRow[]>,
) {
	const rows = rowsByRefNo.get(invoice.refNo ?? "") ?? [];
	const originalAmount = invoice.amount ?? sumOriginalAmount(rows);
	const received = getInvoicePaid(rows);
	const balance =
		rows.length > 0 ? getInvoiceBalance(rows, originalAmount, received) : Math.max(originalAmount - received, 0);

	return { originalAmount, received, balance };
}

export function buildOpenInvoiceSummaryRows(
	invoices: Array<Pick<Invoice, "refNo" | "customerName" | "amount">>,
	previewRows: InvoiceExportPreviewRow[],
): { customerCount: number; totalBalance: number } {
	const rowsByRefNo = groupPreviewRowsByRefNo(previewRows);
	const customerNames = new Set<string>();

	const totalBalance = invoices.reduce((sum, invoice) => {
		if (invoice.customerName) customerNames.add(invoice.customerName);
		return sum + getOpenInvoiceMetrics(invoice, rowsByRefNo).balance;
	}, 0);

	return {
		customerCount: customerNames.size,
		totalBalance,
	};
}

export function buildOpenInvoiceRows(invoices: Invoice[], previewRows: InvoiceExportPreviewRow[]): ReportTemplateRow[] {
	const rowsByRefNo = groupPreviewRowsByRefNo(previewRows);

	return invoices.map((invoice, index) => {
		const { originalAmount, received, balance } = getOpenInvoiceMetrics(invoice, rowsByRefNo);

		return {
			key: invoice.id,
			cells: {
				no: index + 1,
				customer: invoice.customerName ?? "-",
				date: formatDisplayDate(invoice.date),
				refNo: invoice.refNo ?? "-",
				employee: invoice.createdBy ?? "-",
				originalAmount: formatNumber(originalAmount),
				received: formatNumber(received),
				balance: formatNumber(balance),
				paymentTerm: invoice.paymentTerm ?? "-",
				notification: getNotificationText(originalAmount),
			},
		};
	});
}

export function buildCustomerTransactionRows(invoices: Invoice[]): ReportTemplateRow[] {
	return invoices.map((invoice, index) => ({
		key: invoice.id,
		cells: {
			no: index + 1,
			date: formatDisplayDate(invoice.date),
			refNo: invoice.refNo ?? "-",
			customer: invoice.customerName ?? "-",
			type: invoice.type ?? "-",
			amount: formatNumber(invoice.amount ?? 0),
			memo: "-",
		},
	}));
}

function normalizeText(value: string | null | undefined): string {
	return (value ?? "").trim().toLowerCase();
}

function includesAnyKeyword(value: string, keywords: readonly string[]) {
	return keywords.some((keyword) => value.includes(keyword));
}

function isReceiptType(type: string | undefined): boolean {
	return normalizeText(type) === "receipt";
}

function getProductCategory(productName: string | null | undefined): string {
	const normalized = normalizeText(productName);
	if (includesAnyKeyword(normalized, PREMIUM_PRODUCT_KEYWORDS)) return "Premium Ice";
	if (includesAnyKeyword(normalized, ICE_CUBE_KEYWORDS)) return "Ice Cube";
	return "General";
}

function buildInvoiceTypeMap(invoices: Invoice[]): Map<string, string> {
	return new Map(invoices.map((invoice) => [invoice.refNo ?? "", invoice.type ?? ""]));
}

function splitPreviewRowsByInvoiceType(invoices: Invoice[], previewRows: InvoiceExportPreviewRow[]) {
	const typeByRefNo = buildInvoiceTypeMap(invoices);
	return previewRows.reduce<{ cashRows: InvoiceExportPreviewRow[]; creditRows: InvoiceExportPreviewRow[] }>(
		(acc, row) => {
			if (isReceiptType(typeByRefNo.get(row.refNo))) {
				acc.cashRows.push(row);
			} else {
				acc.creditRows.push(row);
			}
			return acc;
		},
		{ cashRows: [], creditRows: [] },
	);
}

export function buildSaleDetailRows(invoices: Invoice[], exportLines: InvoiceExportLineResult[]): ReportTemplateRow[] {
	const typeByRefNo = buildInvoiceTypeMap(invoices);

	return exportLines.map((line, index) => {
		const invoiceType = normalizeText(typeByRefNo.get(line.refNo ?? ""));
		const displayType = invoiceType === "receipt" ? "Receipt" : invoiceType === "invoice" ? "Invoice" : "-";

		return {
			key: `${line.refNo ?? "sale"}-${line.productName ?? index}`,
			cells: {
				no: index + 1,
				date: formatDisplayDate(line.date ?? ""),
				refNo: line.refNo ?? "-",
				type: displayType,
				category: getProductCategory(line.productName),
				item: line.productName ?? "-",
				qty: formatNumber(line.quantity ?? 0),
				price: formatNumber(line.pricePerProduct ?? 0),
				amount: formatNumber(line.amount ?? line.total ?? 0),
			},
		};
	});
}

function sumExpenses(): number {
	return accountingRows.reduce((sum, row) => {
		const debit = Number.parseFloat(String(row.dr ?? "").replaceAll(",", ""));
		return sum + (Number.isFinite(debit) ? debit : 0);
	}, 0);
}

function toSummaryRow(key: string, label: string, detail: string, amount: number): ReportTemplateRow {
	return {
		key,
		cells: {
			label,
			detail,
			amount: `${formatNumber(amount)} Riel`,
		},
	};
}

function buildDailyMetricRow(
	key: string,
	label: string,
	amount: string,
	metricKey: string,
	no: string | number = "",
	quantity = "",
): ReportTemplateRow {
	return {
		key,
		cells: {
			no,
			label,
			quantity,
			amount,
			metricKey,
		},
	};
}

export function buildMonthlyRevenueExpenseRows(
	invoices: Invoice[],
	previewRows: InvoiceExportPreviewRow[],
): ReportTemplateRow[] {
	const { cashRows, creditRows } = splitPreviewRowsByInvoiceType(invoices, previewRows);
	const installmentCollected = creditRows.filter((row) => (row.paid ?? 0) > 0);
	const totalMonthlyIncome = sumOriginalAmount(previewRows);
	const totalCashSales = sumOriginalAmount(cashRows) + sumPaid(creditRows);
	const totalCreditSales = sumOriginalAmount(creditRows);
	const totalInstallments = sumPaid(installmentCollected);
	const totalExpenses = sumExpenses();
	const netTotal = totalMonthlyIncome - totalExpenses - totalCreditSales;

	return [
		toSummaryRow("monthly-income", "Total monthly income", "All invoice and receipt lines", totalMonthlyIncome),
		toSummaryRow(
			"monthly-cash-sales",
			"1- Ice sales cash and debt collections",
			"Receipt rows plus payments collected on credit invoices",
			totalCashSales,
		),
		toSummaryRow(
			"monthly-credit-sales",
			"2- Customer credit sales",
			"Invoice rows in selected period",
			totalCreditSales,
		),
		toSummaryRow(
			"monthly-installments",
			"3- Customer installments",
			"Collected payments recorded on credit invoices",
			totalInstallments,
		),
		toSummaryRow("monthly-expense", "Total monthly expenses", "From accounting ledger debit entries", totalExpenses),
		toSummaryRow("monthly-net", "Monthly cash rolling", "Total income - total expenses - credit sales", netTotal),
	];
}

export function buildApiDailyReportRows(report: DailyReportResponse | undefined): ReportTemplateRow[] {
	const soldProducts = report?.soldProducts ?? [];
	const boughtItems = report?.boughtItems ?? [];
	const soldRows = soldProducts.map((product, index) =>
		buildDailyMetricRow(
			`daily-sold-${index}`,
			product.productName?.trim() || `Sold product ${index + 1}`,
			formatNumber(product.totalAmount ?? 0),
			`sold-${index}`,
			"",
			`${formatNumber(product.totalQuantity ?? 0)} ${product.unit ?? ""}`.trim(),
		),
	);
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
		...soldRows,
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
