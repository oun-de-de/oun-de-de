import type { BorrowerType } from "@/core/types/loan";
import type { ReportTemplateColumn, ReportTemplateSummaryRow } from "../components/layout/report-template-table";
import type { ReportColumnVisibility } from "../components/layout/report-toolbar";

export type ReportDataSource =
	| "invoice-export"
	| "cycle"
	| "customer-list"
	| "product-list"
	| "loan-list"
	| "accounting-mock"
	| "invoice-summary"
	| "daily-report-api"
	| "inventory-stock-report-api"
	| "asset-list"
	| "unsupported";

export type ReportInvoiceType = "invoice" | "receipt";

export interface ReportFilterConfig {
	customer: boolean;
	dateRange: boolean;
	singleDate?: boolean;
}

export const REPORT_FILTERS = {
	customerAndDateRange: { customer: true, dateRange: true },
	customerOnly: { customer: true, dateRange: false },
	dateRangeOnly: { customer: false, dateRange: true },
	noFilters: { customer: false, dateRange: false },
	singleDateOnly: { customer: false, dateRange: false, singleDate: true },
} satisfies Record<string, ReportFilterConfig>;

export interface ReportDefinition {
	slug: string;
	title: string;
	subtitle?: string;
	buildColumns: () => ReportTemplateColumn[];
	hiddenColumnKeys?: (showColumns?: ReportColumnVisibility) => string[];
	columnLabels?: Partial<Record<keyof ReportColumnVisibility, string>>;
	summaryRows?: ReportTemplateSummaryRow[];
	dataSource?: ReportDataSource;
	invoiceType?: ReportInvoiceType;
	loanBorrowerType?: BorrowerType;
	emptyText?: string;
	filterConfig?: ReportFilterConfig;
}

export type ReportDefinitionMap = Record<string, ReportDefinition>;

export function isInvoiceDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "invoice-export" || dataSource === "invoice-summary";
}

export function isDailyReportApiDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "daily-report-api";
}

export function isInventoryStockReportApiDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "inventory-stock-report-api";
}

export function isCycleDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "cycle";
}

export function isCustomerListDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "customer-list";
}

export function isProductListDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "product-list";
}

export function isAssetListDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "asset-list";
}

export function isLoanListDataSource(dataSource: ReportDataSource): boolean {
	return dataSource === "loan-list";
}

export function hasVisibleReportFilters(filterConfig?: ReportFilterConfig): boolean {
	return !!filterConfig && (filterConfig.customer || filterConfig.dateRange || !!filterConfig.singleDate);
}
