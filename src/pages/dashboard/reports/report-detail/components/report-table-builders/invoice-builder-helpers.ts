import type { Invoice, InvoiceExportLineResult, InvoiceExportPreviewRow } from "@/core/types/invoice";
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

export function groupPreviewRowsByRefNo(
	previewRows: InvoiceExportPreviewRow[],
): Map<string, InvoiceExportPreviewRow[]> {
	const previewByRefNo = new Map<string, InvoiceExportPreviewRow[]>();

	for (const previewRow of previewRows) {
		const key = previewRow.refNo || "";
		const current = previewByRefNo.get(key) ?? [];
		current.push(previewRow);
		previewByRefNo.set(key, current);
	}

	return previewByRefNo;
}

export function getNotificationText(amount: number): string {
	if (amount >= 2_000_000) return "Truck credit limit alert";
	if (amount >= 1_000_000) return "Tuk-tuk credit limit alert";
	return "-";
}

export function sumOriginalAmount(rows: InvoiceExportPreviewRow[]): number {
	return rows.reduce((sum, row) => sum + (resolveOriginalAmount(row) ?? 0), 0);
}

export function sumPaid(rows: InvoiceExportPreviewRow[]): number {
	return rows.reduce((sum, row) => sum + (row.paid ?? 0), 0);
}

export function getInvoicePaid(rows: InvoiceExportPreviewRow[]): number {
	const paidValues = rows.map((row) => row.paid ?? 0).filter((value) => value > 0);
	if (paidValues.length === 0) return 0;
	return Math.max(...paidValues);
}

export function getInvoiceBalance(rows: InvoiceExportPreviewRow[], originalAmount: number, received: number): number {
	const balanceValues = rows
		.map((row) => resolveBalance(row, resolveOriginalAmount(row)))
		.filter((value): value is number => value != null && value >= 0);

	if (balanceValues.length > 0) {
		return Math.min(...balanceValues);
	}

	return Math.max(originalAmount - received, 0);
}

export function getOpenInvoiceMetrics(
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

function normalizeText(value: string | null | undefined): string {
	return (value ?? "").trim().toLowerCase();
}

function includesAnyKeyword(value: string, keywords: readonly string[]) {
	return keywords.some((keyword) => value.includes(keyword));
}

function isReceiptType(type: string | undefined): boolean {
	return normalizeText(type) === "receipt";
}

export function getProductCategory(productName: string | null | undefined): string {
	const normalized = normalizeText(productName);
	if (includesAnyKeyword(normalized, PREMIUM_PRODUCT_KEYWORDS)) return "Premium Ice";
	if (includesAnyKeyword(normalized, ICE_CUBE_KEYWORDS)) return "Ice Cube";
	return "General";
}

export function buildInvoiceTypeMap(invoices: Invoice[]): Map<string, string> {
	return new Map(invoices.map((invoice) => [invoice.refNo ?? "", invoice.type ?? ""]));
}

export function splitPreviewRowsByInvoiceType(invoices: Invoice[], previewRows: InvoiceExportPreviewRow[]) {
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
