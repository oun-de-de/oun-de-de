import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import customerService from "@/core/api/services/customer-service";
import cycleService from "@/core/api/services/cycle-service";
import invoiceService from "@/core/api/services/invoice-service";
import loanService from "@/core/api/services/loan-service";
import productService from "@/core/api/services/product-service";
import reportService from "@/core/api/services/report-service";
import type { InvoiceExportPreviewRow } from "@/core/types/invoice";
import type { Installment } from "@/core/types/loan";
import type { SortMode } from "../../../invoice/export-preview/constants";
import type { ReportTemplateRow } from "../../components/layout/report-template-table";
import { getReportDefinition } from "../report-registry";
import {
	isAssetListDataSource,
	isCustomerListDataSource,
	isCycleDataSource,
	isDailyReportApiDataSource,
	isInventoryStockReportApiDataSource,
	isInvoiceDataSource,
	isLoanListDataSource,
	isProductListDataSource,
	type ReportDataSource,
} from "../report-types";
import type { ReportFiltersValue } from "./report-filters";
import {
	buildCompanyAssetRows,
	buildCustomerListRows,
	buildCustomerLoanRows,
	buildCustomerTransactionRows,
	buildCycleReportRows,
	buildApiDailyReportRows,
	buildEmployeeLoanRows,
	buildInventoryBagRows,
	filterInventoryStockReportRowsByDate,
	buildInventoryStockReportRows,
	buildInvoiceReportRows,
	buildOpenInvoiceRows,
	buildLedgerRows,
	buildMonthlyRevenueExpenseRows,
	buildProductListRows,
	buildSaleDetailRows,
	buildTrialBalanceRows,
	mapExportLinesToPreviewRows,
} from "./report-table-builders";
import { normalizeReportFilters, sortReportRows } from "./report-table-utils";

interface UseReportTableDataParams {
	reportSlug: string;
	filters?: ReportFiltersValue;
	sortMode: SortMode;
}

type InvoiceList = Awaited<ReturnType<typeof invoiceService.getInvoices>>["list"];
type InvoiceExportLines = Awaited<ReturnType<typeof invoiceService.exportInvoice>>;
type CycleList = Awaited<ReturnType<typeof cycleService.getCycles>>["list"];
type CustomerList = Awaited<ReturnType<typeof customerService.getCustomerList>>["list"];
type LoanContent = Awaited<ReturnType<typeof loanService.getLoans>>["content"];
type ProductList = Awaited<ReturnType<typeof productService.getProductList>>;
type DailyReportData = Awaited<ReturnType<typeof reportService.getDailyReport>>;
type InventoryStockReportData = Awaited<ReturnType<typeof reportService.getInventoryStockReport>>;

interface BuildSourceRowsParams {
	reportSlug: string;
	dataSource: ReportDataSource;
	loanBorrowerType?: "customer" | "employee";
	invoices: InvoiceList;
	exportLines: InvoiceExportLines;
	previewRows: InvoiceExportPreviewRow[];
	cycles: CycleList;
	filteredCustomers: CustomerList;
	allCustomers: CustomerList;
	loanContent: LoanContent;
	installmentsByLoanId: Record<string, Installment[]>;
	products: ProductList;
	dailyReport: DailyReportData | undefined;
	inventoryStockReport: InventoryStockReportData | undefined;
	inventoryDateFrom?: string;
	inventoryDateTo?: string;
}

function buildInvoiceSourceRows({
	reportSlug,
	invoices,
	exportLines,
	previewRows,
}: Pick<BuildSourceRowsParams, "reportSlug" | "invoices" | "exportLines" | "previewRows">): ReportTemplateRow[] {
	if (reportSlug === "sale-detail-by-customer") {
		return buildSaleDetailRows(invoices, exportLines);
	}
	if (reportSlug === "open-invoice-detail-by-customer") {
		return buildOpenInvoiceRows(invoices, previewRows);
	}
	if (reportSlug === "profit-and-loss") {
		return buildMonthlyRevenueExpenseRows(invoices, previewRows);
	}
	if (reportSlug === "customer-transaction") {
		return buildCustomerTransactionRows(invoices);
	}
	return buildInvoiceReportRows(exportLines);
}

function buildLoanSourceRows({
	loanBorrowerType,
	loanContent,
	allCustomers,
	installmentsByLoanId,
}: Pick<BuildSourceRowsParams, "loanBorrowerType" | "loanContent" | "allCustomers" | "installmentsByLoanId">) {
	return loanBorrowerType === "employee"
		? buildEmployeeLoanRows(loanContent, installmentsByLoanId)
		: buildCustomerLoanRows(loanContent, allCustomers, installmentsByLoanId);
}

function buildProductSourceRows({
	reportSlug,
	products,
}: Pick<BuildSourceRowsParams, "reportSlug" | "products">): ReportTemplateRow[] {
	return reportSlug === "inventory-valuation-summary"
		? buildInventoryBagRows(products)
		: buildProductListRows(products);
}

function buildSourceRows({
	reportSlug,
	dataSource,
	loanBorrowerType,
	invoices,
	exportLines,
	previewRows,
	cycles,
	filteredCustomers,
	allCustomers,
	loanContent,
	installmentsByLoanId,
	products,
	dailyReport,
	inventoryStockReport,
	inventoryDateFrom,
	inventoryDateTo,
}: BuildSourceRowsParams): ReportTemplateRow[] {
	switch (dataSource) {
		case "invoice-export":
		case "invoice-summary":
			return buildInvoiceSourceRows({ reportSlug, invoices, exportLines, previewRows });
		case "cycle":
			return buildCycleReportRows(cycles);
		case "customer-list":
			return buildCustomerListRows(filteredCustomers);
		case "loan-list":
			return buildLoanSourceRows({
				loanBorrowerType,
				loanContent,
				allCustomers,
				installmentsByLoanId,
			});
		case "asset-list":
			return buildCompanyAssetRows(products);
		case "product-list":
			return buildProductSourceRows({ reportSlug, products });
		case "inventory-stock-report-api":
			return filterInventoryStockReportRowsByDate(
				buildInventoryStockReportRows(inventoryStockReport),
				inventoryDateFrom,
				inventoryDateTo,
			);
		case "accounting-mock":
			return reportSlug === "trial-balance" ? buildTrialBalanceRows() : buildLedgerRows();
		case "daily-report-api":
			return buildApiDailyReportRows(dailyReport);
		case "unsupported":
		default:
			return [];
	}
}

export function useReportTableData({ reportSlug, filters, sortMode }: UseReportTableDataParams) {
	const definition = getReportDefinition(reportSlug);
	const dataSource = definition.dataSource ?? "invoice-export";
	const { customerId, reportDateFrom, reportDateTo } = normalizeReportFilters(filters);

	const isInvoiceExport = isInvoiceDataSource(dataSource);
	const isCycle = isCycleDataSource(dataSource);
	const isCustomerList = isCustomerListDataSource(dataSource);
	const isProductList = isProductListDataSource(dataSource);
	const isAssetList = isAssetListDataSource(dataSource);
	const isLoanList = isLoanListDataSource(dataSource);
	const isDailyReportApi = isDailyReportApiDataSource(dataSource);
	const isInventoryStockReportApi = isInventoryStockReportApiDataSource(dataSource);
	const isSimpleTransactionReport = reportSlug === "customer-transaction";
	const reportDate =
		(isDailyReportApi ? filters?.fromDate : undefined) || filters?.toDate || new Date().toISOString().slice(0, 10);
	const inventoryDateFrom = filters?.fromDate || reportDate;
	const inventoryDateTo = filters?.toDate || inventoryDateFrom;
	const inventoryHistoryDateFrom = "1970-01-01";

	const cycleQuery = useQuery({
		queryKey: ["report", "cycle-list", customerId ?? "all", reportDateFrom ?? "", reportDateTo ?? ""],
		queryFn: () =>
			cycleService.getCycles({
				page: 1,
				size: 10000,
				sort: "startDate,desc",
				customerId,
				from: reportDateFrom,
				to: reportDateTo,
			}),
		enabled: isCycle,
	});

	const invoiceQuery = useQuery({
		queryKey: ["report", "invoice-list", reportSlug, customerId ?? "all", reportDateFrom ?? "", reportDateTo ?? ""],
		queryFn: () =>
			invoiceService.getInvoices({
				page: 1,
				size: 10000,
				sort: "date,desc",
				type: definition.invoiceType,
				customerId,
				from: reportDateFrom,
				to: reportDateTo,
			}),
		enabled: isInvoiceExport,
	});

	const invoiceIds = useMemo(
		() => (isInvoiceExport ? (invoiceQuery.data?.list ?? []).map((invoice) => invoice.id) : []),
		[isInvoiceExport, invoiceQuery.data?.list],
	);

	const exportQuery = useQuery({
		queryKey: ["report", "invoice-export", invoiceIds],
		queryFn: () => invoiceService.exportInvoice(invoiceIds),
		enabled: isInvoiceExport && !isSimpleTransactionReport && invoiceIds.length > 0,
	});

	const customerQuery = useQuery({
		queryKey: ["report", "customer-list", "all"],
		queryFn: () => customerService.getCustomerList({ limit: 10000 }),
		enabled:
			isCustomerList ||
			(isLoanList && definition.loanBorrowerType === "customer") ||
			Boolean(definition.filterConfig?.customer && customerId),
	});

	const productQuery = useQuery({
		queryKey: ["report", "product-list"],
		queryFn: () => productService.getProductList(),
		enabled: isProductList || isAssetList,
	});

	const loanQuery = useQuery({
		queryKey: [
			"report",
			"loan-list",
			definition.loanBorrowerType ?? "customer",
			customerId ?? "all",
			reportDateFrom ?? "",
			reportDateTo ?? "",
		],
		queryFn: () =>
			loanService.getLoans({
				borrower_type: definition.loanBorrowerType,
				borrower_id: definition.loanBorrowerType === "customer" ? customerId : undefined,
				from: reportDateFrom,
				to: reportDateTo,
				page: 1,
				size: 10000,
				sort: "createAt,desc",
			}),
		enabled: isLoanList,
	});

	const dailyReportQuery = useQuery({
		queryKey: ["report", "daily-report", reportDate],
		queryFn: () => reportService.getDailyReport(reportDate),
		enabled: isDailyReportApi,
	});

	const inventoryStockReportQuery = useQuery({
		queryKey: ["report", "inventory-stock-report", inventoryHistoryDateFrom, inventoryDateTo],
		queryFn: () => reportService.getInventoryStockReport(inventoryHistoryDateFrom, inventoryDateTo),
		enabled: isInventoryStockReportApi,
	});

	const loanInstallmentQueries = useQueries({
		queries: (loanQuery.data?.content ?? []).map((loan) => ({
			queryKey: ["report", "loan-installments", loan.id],
			queryFn: () => loanService.getInstallments(loan.id),
			enabled: isLoanList,
		})),
	});

	const filteredCustomers = useMemo(() => {
		const customers = customerQuery.data?.list ?? [];
		return customerId ? customers.filter((customer) => customer.id === customerId) : customers;
	}, [customerId, customerQuery.data?.list]);

	const installmentsByLoanId = useMemo<Record<string, Installment[]>>(
		() =>
			(loanQuery.data?.content ?? []).reduce<Record<string, Installment[]>>((acc, loan, index) => {
				acc[loan.id] = loanInstallmentQueries[index]?.data ?? [];
				return acc;
			}, {}),
		[loanInstallmentQueries, loanQuery.data?.content],
	);

	const previewRows = useMemo<InvoiceExportPreviewRow[]>(
		() => mapExportLinesToPreviewRows(exportQuery.data ?? []),
		[exportQuery.data],
	);

	const sourceRows = useMemo<ReportTemplateRow[]>(
		() =>
			buildSourceRows({
				reportSlug,
				dataSource,
				loanBorrowerType: definition.loanBorrowerType,
				invoices: invoiceQuery.data?.list ?? [],
				exportLines: exportQuery.data ?? [],
				previewRows,
				cycles: cycleQuery.data?.list ?? [],
				filteredCustomers,
				allCustomers: customerQuery.data?.list ?? [],
				loanContent: loanQuery.data?.content ?? [],
				installmentsByLoanId,
				products: productQuery.data ?? [],
				dailyReport: dailyReportQuery.data,
				inventoryStockReport: inventoryStockReportQuery.data,
				inventoryDateFrom,
				inventoryDateTo,
			}),
		[
			cycleQuery.data?.list,
			customerQuery.data?.list,
			dataSource,
			dailyReportQuery.data,
			definition.loanBorrowerType,
			exportQuery.data,
			filteredCustomers,
			installmentsByLoanId,
			inventoryStockReportQuery.data,
			invoiceQuery.data?.list,
			loanQuery.data?.content,
			previewRows,
			productQuery.data,
			reportSlug,
		],
	);

	const sortedRows = useMemo(() => sortReportRows(sourceRows, sortMode), [sourceRows, sortMode]);
	const selectedCustomerLabel = useMemo(() => {
		if (!customerId) return "All";
		const selectedCustomer = customerQuery.data?.list.find((customer) => customer.id === customerId);
		return selectedCustomer?.name ?? "Filtered";
	}, [customerId, customerQuery.data?.list]);

	return {
		definition,
		invoiceIds,
		previewRows,
		selectedCustomerLabel,
		sourceRows,
		sortedRows,
	};
}
