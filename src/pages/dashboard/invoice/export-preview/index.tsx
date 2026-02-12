import { format, isValid, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import Icon from "@/core/components/icon/icon";
import invoiceService from "@/core/services/invoice-service";
import type { InvoiceExportPreviewLocationState, InvoiceExportPreviewRow } from "@/core/types/invoice";
import { Button } from "@/core/ui/button";
import { ReportFilterBar } from "../../reports/components/layout/report-filter-bar";
import {
	type ReportColumnVisibility,
	type ReportSectionVisibility,
	ReportToolbar,
} from "../../reports/components/layout/report-toolbar";
import { ReportFilters } from "../../reports/report-detail/components/report-filters";
import { ReportTable } from "../../reports/report-detail/components/report-table";
import {
	DEFAULT_REPORT_COLUMNS,
	DEFAULT_REPORT_SECTIONS,
	REPORT_DEFAULT_DATE,
	REPORT_FOOTER_TEXT,
	REPORT_TIMESTAMP_TEXT,
} from "../../reports/report-detail/constants";

const EMPTY_CELL = "-";
const EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const toolbarButtonClassName = "h-8 gap-1.5 px-2 text-sky-600 hover:bg-sky-50";

function formatNumber(value: number | null): string {
	if (value === null) return EMPTY_CELL;
	return value.toLocaleString();
}

function formatReportDate(value: string): string {
	const parsed = parseISO(value);
	if (!isValid(parsed)) return value;
	return format(parsed, "dd/MM/yyyy");
}

function resolveOriginalAmount(row: InvoiceExportPreviewRow): number | null {
	return (
		row.amount ??
		row.total ??
		(row.pricePerProduct !== null && row.quantity !== null ? row.pricePerProduct * row.quantity : null)
	);
}

function resolveBalance(row: InvoiceExportPreviewRow, originalAmount: number | null): number | null {
	if (row.balance !== null) return row.balance;
	if (originalAmount === null) return null;
	return Math.max(0, originalAmount - (row.paid ?? 0));
}

export default function InvoiceExportPreviewPage() {
	const location = useLocation();
	const [isExporting, setIsExporting] = useState(false);
	const state = (location.state as InvoiceExportPreviewLocationState | null) ?? null;
	const selectedInvoiceIds = state?.selectedInvoiceIds ?? [];
	const previewRows = state?.previewRows ?? [];
	const [showSections, setShowSections] = useState<ReportSectionVisibility>(DEFAULT_REPORT_SECTIONS);
	const [showColumns, setShowColumns] = useState<ReportColumnVisibility>(DEFAULT_REPORT_COLUMNS);

	const reportRows = useMemo(() => {
		return previewRows.map((row, index) => {
			const originalAmount = resolveOriginalAmount(row);
			const received = row.paid;
			const balance = resolveBalance(row, originalAmount);

			return {
				key: `${row.refNo}-${row.productName ?? "no-item"}-${index}`,
				cells: {
					no: index + 1,
					customer: row.customerName,
					date: formatReportDate(row.date),
					refNo: row.refNo,
					employee: EMPTY_CELL,
					category: EMPTY_CELL,
					geography: EMPTY_CELL,
					address: EMPTY_CELL,
					phone: EMPTY_CELL,
					originalAmount: formatNumber(originalAmount),
					received: formatNumber(received),
					balance: formatNumber(balance),
				},
			};
		});
	}, [previewRows]);

	const totalBalance = useMemo(() => {
		return previewRows.reduce((sum, row) => {
			const originalAmount = resolveOriginalAmount(row);
			const nextBalance = resolveBalance(row, originalAmount) ?? 0;
			return sum + nextBalance;
		}, 0);
	}, [previewRows]);

	const handleConfirmExport = async () => {
		if (selectedInvoiceIds.length === 0) {
			toast.error("Please select invoice(s) before exporting");
			return;
		}

		try {
			setIsExporting(true);
			const response = await invoiceService.exportInvoice(selectedInvoiceIds);
			const blob = new Blob([response], {
				type: EXCEL_MIME_TYPE,
			});
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `invoice-export-${Date.now()}.xlsx`;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
			toast.success("Invoice exported successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to export invoice");
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="flex h-full flex-col gap-4 p-2">
			{showSections.filter && (
				<ReportFilterBar title="Filter" icon="mdi:filter-outline" defaultOpen={true}>
					<ReportFilters />
				</ReportFilterBar>
			)}

			<div className="flex flex-col">
				<ReportToolbar
					className="rounded-b-none border-b-0"
					showSections={showSections}
					onShowSectionsChange={setShowSections}
					showColumns={showColumns}
					onShowColumnsChange={setShowColumns}
					rightActions={
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" className={toolbarButtonClassName}>
								<Icon icon="mdi:cog-outline" size="1.2em" />
								<span className="text-xs font-medium">Customize</span>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className={toolbarButtonClassName}
								onClick={handleConfirmExport}
								disabled={selectedInvoiceIds.length === 0 || isExporting}
							>
								<Icon icon="mdi:file-excel-outline" size="1.2em" />
								<span className="text-xs font-medium">{isExporting ? "Exporting..." : "Export Excel"}</span>
							</Button>
							<Button variant="ghost" size="sm" className={toolbarButtonClassName}>
								<Icon icon="mdi:printer-outline" size="1.2em" />
								<span className="text-xs font-medium">Print</span>
							</Button>
							<Button variant="ghost" size="sm" className={toolbarButtonClassName}>
								<Icon icon="mdi:content-copy" size="1.2em" />
								<span className="text-xs font-medium">Copy</span>
							</Button>
						</div>
					}
				/>

				<ReportTable
					className="rounded-t-none gap-6 p-6"
					showSections={showSections}
					showColumns={showColumns}
					subtitle={REPORT_DEFAULT_DATE}
					rows={reportRows}
					totalCustomer={selectedInvoiceIds.length}
					totalBalance={totalBalance}
					timestampText={REPORT_TIMESTAMP_TEXT}
					footerText={REPORT_FOOTER_TEXT}
				/>
			</div>
		</div>
	);
}
