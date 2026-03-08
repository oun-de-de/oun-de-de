import type { ReactNode } from "react";
import type { InvoiceExportPreviewRow } from "@/core/types/invoice";
import { formatNumber } from "@/core/utils/formatters";
import type {
	ReportTemplateMetaColumn,
	ReportTemplateRow,
	ReportTemplateSummaryRow,
} from "../../components/layout/report-template-table";
import type { ReportFiltersValue } from "./report-filters";
import { buildOpenInvoiceSummaryRows } from "./report-table-builders";
import { formatFilterRange, parseNumericCell } from "./report-table-utils";

export interface ReportPresentation {
	headerContent: ReactNode;
	metaColumns?: ReportTemplateMetaColumn[];
	summaryRows?: ReportTemplateSummaryRow[];
	emptyText?: string;
	showTableHeader?: boolean;
}

type SummaryDefinition = {
	key: string;
	label: string;
	value: string | number;
};

function buildDefaultHeader(title: string, dateText: string) {
	return (
		<div className="flex flex-col items-center gap-1 text-center text-black">
			<div className="text-[11px] font-normal">{title}</div>
			<div className="pb-0 text-[22px] font-bold">ហាងចក្រទឹកកក លឹម ច័ន្ទ II</div>
			<div className="pb-3 text-[13px] font-semibold underline">TEL: 070669898</div>
			<div className="text-base font-semibold text-slate-600">{dateText}</div>
		</div>
	);
}

function buildLedgerMetaColumns(): ReportTemplateMetaColumn[] {
	return [
		{
			key: "currency",
			rows: ["Currency: KHR"],
			align: "left",
			className: "md:col-span-1",
		},
	];
}

function buildOpenInvoiceMetaColumns(customerLabel?: string): ReportTemplateMetaColumn[] {
	const customerDisplay = customerLabel?.trim() || "Filtered";

	return [{ key: "customer", rows: [`Customer: ${customerDisplay}`], align: "left", className: "md:col-span-1" }];
}

function buildCustomerLoanMetaColumns(): ReportTemplateMetaColumn[] {
	return [
		{ key: "title", rows: ["Customer Borrow Money"], className: "md:col-span-1" },
		{
			key: "term",
			rows: ["Payment term: Monthly Installments"],
			align: "center",
			className: "md:col-span-1",
		},
		{ key: "scope", rows: ["Borrower type: Customer"], align: "right", className: "md:col-span-1" },
	];
}

function buildEmployeeLoanMetaColumns(): ReportTemplateMetaColumn[] {
	return [
		{ key: "title", rows: ["Employee Borrow Money"], className: "md:col-span-1" },
		{
			key: "term",
			rows: ["Payment term: Monthly Installments"],
			align: "center",
			className: "md:col-span-1",
		},
		{ key: "scope", rows: ["Employee Loan Ledger"], align: "right", className: "md:col-span-1" },
	];
}

function buildCompanyAssetMetaColumns(): ReportTemplateMetaColumn[] {
	return [
		{
			key: "scope",
			rows: ["Company Asset Register", "Source: product catalog records"],
			className: "md:col-span-1",
		},
		{
			key: "supplier",
			rows: ["Supplier fields are derived from product reference only", "No dedicated asset vendor API is available"],
			align: "center",
			className: "md:col-span-1",
		},
		{
			key: "valuation",
			rows: ["Balance is based on quantity x cost", "Credit remains blank in current source data"],
			align: "right",
			className: "md:col-span-1",
		},
	];
}

function sumCell(rows: ReportTemplateRow[], cellKey: string) {
	return rows.reduce((sum, row) => sum + parseNumericCell(row.cells[cellKey]), 0);
}

function sumLatestBalanceByItem(rows: ReportTemplateRow[]): number {
	const latestBalanceByItem = new Map<string, number>();

	for (const row of rows) {
		const itemKey =
			String(row.cells.itemCode ?? "").trim() || String(row.cells.balanceName ?? "").trim() || String(row.key);

		latestBalanceByItem.set(itemKey, parseNumericCell(row.cells.balanceQty));
	}

	return [...latestBalanceByItem.values()].reduce((sum, balance) => sum + balance, 0);
}

function toSummaryRows(items: SummaryDefinition[]): ReportTemplateSummaryRow[] {
	return items.map((item) => ({
		key: item.key,
		label: item.label,
		value: item.value,
	}));
}

function buildSingleAmountSummary(
	key: string,
	label: string,
	amount: unknown,
	suffix = "",
): ReportTemplateSummaryRow[] {
	return toSummaryRows([
		{
			key,
			label,
			value: `${formatNumber(parseNumericCell(amount))}${suffix}`,
		},
	]);
}

function buildDebitCreditSummary(prefix: string, rows: ReportTemplateRow[]): ReportTemplateSummaryRow[] {
	return toSummaryRows([
		{ key: `${prefix}-debit`, label: "Total debit", value: formatNumber(sumCell(rows, "debit")) },
		{ key: `${prefix}-credit`, label: "Total credit", value: formatNumber(sumCell(rows, "credit")) },
	]);
}

function buildWorkbookPresentation(
	workbookTitle: string,
	workbookSubtitle: string,
	summaryRows?: ReportTemplateSummaryRow[],
	emptyText?: string,
): ReportPresentation {
	return {
		headerContent: buildDefaultHeader(`${workbookTitle} ${workbookSubtitle}`.trim(), ""),
		summaryRows,
		emptyText,
	};
}

function buildSimplePresentation(
	title: string,
	dateText: string,
	options?: {
		metaColumns?: ReportTemplateMetaColumn[];
		summaryRows?: ReportTemplateSummaryRow[];
		emptyText?: string;
	},
): ReportPresentation {
	return {
		headerContent: buildDefaultHeader(title, dateText),
		metaColumns: options?.metaColumns,
		summaryRows: options?.summaryRows,
		emptyText: options?.emptyText,
	};
}

function buildLedgerPresentation(
	title: string,
	dateText: string,
	summaryRows?: ReportTemplateSummaryRow[],
	emptyText?: string,
): ReportPresentation {
	return {
		headerContent: buildDefaultHeader(title, dateText),
		metaColumns: buildLedgerMetaColumns(),
		summaryRows,
		emptyText,
	};
}

export function buildReportPresentation(
	reportSlug: string,
	title: string,
	filters: ReportFiltersValue | undefined,
	selectedCustomerLabel: string | undefined,
	rows: ReportTemplateRow[],
	previewRows: InvoiceExportPreviewRow[],
): ReportPresentation {
	const dateText = formatFilterRange(filters);

	if (reportSlug === "profit-and-loss") {
		return buildWorkbookPresentation(
			"Revenue and Expense Statement",
			"Monthly report format",
			buildSingleAmountSummary("monthly-total", "Net total", rows.at(-1)?.cells.amount, " Riel"),
			"No monthly data available.",
		);
	}

	if (reportSlug === "daily-report") {
		const dailyCashReceive = rows.find((row) => row.cells.metricKey === "daily-cash-receive")?.cells.amount;
		const dailyExpense = rows.find((row) => row.cells.metricKey === "daily-expense-total")?.cells.amount;
		return {
			headerContent: buildDefaultHeader(title, dateText),
			showTableHeader: false,
			summaryRows: toSummaryRows([
				{
					key: "daily-net-cash",
					label: "Cash balance after expense",
					value: `${formatNumber(parseNumericCell(dailyCashReceive) - parseNumericCell(dailyExpense))} KHR`,
				},
			]),
			emptyText: "No daily data available.",
		};
	}

	if (reportSlug === "company-asset") {
		return buildSimplePresentation("Company Asset Report", dateText, {
			metaColumns: buildCompanyAssetMetaColumns(),
			summaryRows: buildSingleAmountSummary("asset-total", "Total asset value", sumCell(rows, "balance")),
			emptyText: "No asset rows available.",
		});
	}

	if (reportSlug === "general-ledger" || reportSlug === "balance-sheet") {
		return buildLedgerPresentation(title, dateText, buildDebitCreditSummary("ledger", rows));
	}

	if (reportSlug === "trial-balance") {
		return buildLedgerPresentation(title, dateText, buildDebitCreditSummary("trial", rows));
	}

	if (reportSlug === "inventory-valuation-summary") {
		return buildWorkbookPresentation(
			"Inventory Stock Report",
			"Q#8 Ice Bag Inventory",
			buildSingleAmountSummary("inventory-balance", "Total balance qty", sumLatestBalanceByItem(rows)),
		);
	}

	if (reportSlug === "customer-transaction") {
		return buildSimplePresentation("Customer Borrow Money", dateText, {
			metaColumns: buildCustomerLoanMetaColumns(),
			summaryRows: toSummaryRows([
				{ key: "loan-debit", label: "Total principal", value: formatNumber(sumCell(rows, "debit")) },
				{ key: "loan-credit", label: "Total collected", value: formatNumber(sumCell(rows, "credit")) },
				{ key: "loan-balance", label: "Outstanding balance", value: formatNumber(sumCell(rows, "balance")) },
			]),
			emptyText: "No customer loans found.",
		});
	}

	if (reportSlug === "customer-transaction-detail-by-type") {
		return buildSimplePresentation(title, dateText, {
			metaColumns: buildEmployeeLoanMetaColumns(),
			summaryRows: buildDebitCreditSummary("employee-loan", rows),
			emptyText: "No employee loans found.",
		});
	}

	if (reportSlug === "sale-detail-by-customer") {
		return buildSimplePresentation(title, dateText, {
			summaryRows: buildSingleAmountSummary("sales-total", "Total amount", sumCell(rows, "amount")),
		});
	}

	if (reportSlug === "open-invoice-detail-by-customer") {
		const openInvoiceRows = rows.map((row) => ({
			refNo: String(row.cells.refNo ?? ""),
			customerName: String(row.cells.customer ?? ""),
			amount: parseNumericCell(row.cells.originalAmount),
		}));
		const { customerCount, totalBalance } = buildOpenInvoiceSummaryRows(openInvoiceRows, previewRows);
		return buildSimplePresentation(title, dateText, {
			metaColumns: buildOpenInvoiceMetaColumns(selectedCustomerLabel),
			summaryRows: [
				{ key: "invoice-customers", label: "Total customer", value: customerCount },
				{ key: "invoice-balance", label: "Total balance", value: `${formatNumber(totalBalance)} ៛` },
			],
		});
	}

	return buildSimplePresentation(title, dateText);
}
