import { REPORT_DEFAULT_DATE } from "./constants";
import {
	buildLedgerColumns,
	buildMonthlySummaryColumns,
	buildTrialBalanceColumns,
} from "./report-columns/accounting-report-columns";
import { buildCustomerListColumns, buildCycleColumns } from "./report-columns/core-report-columns";
import { buildDailyReportColumns } from "./report-columns/daily-report-columns";
import {
	buildInvoiceHiddenColumnKeys,
	buildOpenInvoiceDetailColumns,
	buildReceiptDetailColumns,
	buildSaleDetailHiddenColumnKeys,
	buildSaleDetailColumns,
	INVOICE_REPORT_COLUMN_LABELS,
	SALE_DETAIL_REPORT_COLUMN_LABELS,
} from "./report-columns/invoice-report-columns";
import {
	buildCompanyAssetColumns,
	buildInventoryStockColumns,
	buildProductListColumns,
} from "./report-columns/inventory-report-columns";
import { buildCustomerLoanColumns, buildEmployeeLoanColumns } from "./report-columns/loan-report-columns";
import { REPORT_FILTERS, type ReportDefinition, type ReportDefinitionMap } from "./report-types";

export const REPORT_REGISTRY: ReportDefinitionMap = {
	"open-invoice-detail-by-customer": {
		slug: "open-invoice-detail-by-customer",
		title: "Open Invoice Detail Report",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildOpenInvoiceDetailColumns,
		columnLabels: INVOICE_REPORT_COLUMN_LABELS,
		hiddenColumnKeys: buildInvoiceHiddenColumnKeys,
		dataSource: "invoice-export",
		filterConfig: REPORT_FILTERS.customerAndDateRange,
	},
	"sale-detail-by-customer": {
		slug: "sale-detail-by-customer",
		title: "Sale Detail By Customer",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildSaleDetailColumns,
		columnLabels: SALE_DETAIL_REPORT_COLUMN_LABELS,
		hiddenColumnKeys: buildSaleDetailHiddenColumnKeys,
		dataSource: "invoice-export",
		invoiceType: "invoice",
		filterConfig: REPORT_FILTERS.customerAndDateRange,
	},
	"receipt-detail-by-customer": {
		slug: "receipt-detail-by-customer",
		title: "Receipt Detail By Customer",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildReceiptDetailColumns,
		columnLabels: INVOICE_REPORT_COLUMN_LABELS,
		hiddenColumnKeys: buildInvoiceHiddenColumnKeys,
		dataSource: "invoice-export",
		invoiceType: "receipt",
		filterConfig: REPORT_FILTERS.customerAndDateRange,
	},
	"open-invoice-on-period-by-group": {
		slug: "open-invoice-on-period-by-group",
		title: "Open Invoice By Period Group",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildCycleColumns,
		dataSource: "cycle",
		filterConfig: REPORT_FILTERS.customerAndDateRange,
	},
	"customer-list": {
		slug: "customer-list",
		title: "Customer List",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildCustomerListColumns,
		dataSource: "customer-list",
		filterConfig: REPORT_FILTERS.customerOnly,
	},
	"customer-transaction": {
		slug: "customer-transaction",
		title: "Customer Loan Register",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildCustomerLoanColumns,
		dataSource: "loan-list",
		loanBorrowerType: "customer",
		filterConfig: REPORT_FILTERS.customerAndDateRange,
	},
	"customer-transaction-detail-by-type": {
		slug: "customer-transaction-detail-by-type",
		title: "Employee Loan Ledger",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildEmployeeLoanColumns,
		dataSource: "loan-list",
		loanBorrowerType: "employee",
		filterConfig: REPORT_FILTERS.dateRangeOnly,
	},
	"inventory-valuation-summary": {
		slug: "inventory-valuation-summary",
		title: "Inventory Stock Report",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildInventoryStockColumns,
		dataSource: "inventory-stock-report-api",
		filterConfig: REPORT_FILTERS.dateRangeOnly,
	},
	"product-list": {
		slug: "product-list",
		title: "Product List",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildProductListColumns,
		dataSource: "product-list",
		filterConfig: REPORT_FILTERS.noFilters,
	},
	"company-asset": {
		slug: "company-asset",
		title: "Company Asset Register",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildCompanyAssetColumns,
		dataSource: "asset-list",
		filterConfig: REPORT_FILTERS.noFilters,
	},
	"general-ledger": {
		slug: "general-ledger",
		title: "General Ledger",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildLedgerColumns,
		dataSource: "accounting-mock",
		filterConfig: REPORT_FILTERS.noFilters,
	},
	"trial-balance": {
		slug: "trial-balance",
		title: "Trial Balance",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildTrialBalanceColumns,
		dataSource: "accounting-mock",
		filterConfig: REPORT_FILTERS.noFilters,
	},
	"profit-and-loss": {
		slug: "profit-and-loss",
		title: "Monthly Revenue & Expense",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildMonthlySummaryColumns,
		dataSource: "invoice-summary",
		filterConfig: REPORT_FILTERS.customerAndDateRange,
	},
	"balance-sheet": {
		slug: "balance-sheet",
		title: "Income & Expense Ledger",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildLedgerColumns,
		dataSource: "accounting-mock",
		filterConfig: REPORT_FILTERS.noFilters,
	},
	"daily-report": {
		slug: "daily-report",
		title: "Daily Report",
		subtitle: REPORT_DEFAULT_DATE,
		buildColumns: buildDailyReportColumns,
		dataSource: "daily-report-api",
		filterConfig: REPORT_FILTERS.singleDateOnly,
	},
};

export const DEFAULT_REPORT_SLUG = "open-invoice-detail-by-customer";

export function hasReportDefinition(slug?: string): slug is string {
	return !!slug && slug in REPORT_REGISTRY;
}

export function getReportDefinition(slug?: string): ReportDefinition {
	return hasReportDefinition(slug) ? REPORT_REGISTRY[slug] : REPORT_REGISTRY[DEFAULT_REPORT_SLUG];
}
