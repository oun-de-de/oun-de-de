import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { SmartDataTable, SplitButton, SummaryStatCard } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import type { SummaryStatCardData } from "@/core/types/common";
import type { InvoiceRow } from "@/core/types/invoice";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";
import { INVOICE_FILTER_FIELD_OPTIONS, INVOICE_FILTER_TYPE_OPTIONS } from "../constants";
import { getInvoiceColumns } from "./invoice-columns";

type InvoiceContentProps = {
	pagedData: InvoiceRow[];
	summaryCards: SummaryStatCardData[];
	activeInvoiceLabel?: string | null;
	typeFilter: string;
	fieldFilter: string;
	searchValue: string;
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	paginationItems: Array<number | "...">;
	onTypeFilterChange: (value: string) => void;
	onFieldFilterChange: (value: string) => void;
	onSearchChange: (value: string) => void;
	onPageChange: (value: number) => void;
	onPageSizeChange: (value: number) => void;
};

export function InvoiceContent({
	pagedData,
	summaryCards,
	activeInvoiceLabel,
	typeFilter,
	fieldFilter,
	searchValue,
	currentPage,
	pageSize,
	totalItems,
	totalPages,
	paginationItems,
	onTypeFilterChange,
	onFieldFilterChange,
	onSearchChange,
	onPageChange,
	onPageSizeChange,
}: InvoiceContentProps) {
	const navigate = useNavigate();
	const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
	const selectedIdSet = useMemo(() => new Set(selectedInvoiceIds), [selectedInvoiceIds]);
	const visibleIds = useMemo(() => pagedData.map((row) => row.id), [pagedData]);
	const selectedVisibleCount = visibleIds.filter((id) => selectedIdSet.has(id)).length;
	const allSelected = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
	const partiallySelected = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;

	const columns = useMemo(
		() =>
			getInvoiceColumns({
				allSelected,
				partiallySelected,
				selectedIds: selectedIdSet,
				onToggleAll: (checked) => {
					setSelectedInvoiceIds((prev) => {
						const prevSet = new Set(prev);
						if (checked) {
							for (const id of visibleIds) {
								prevSet.add(id);
							}
						} else {
							for (const id of visibleIds) {
								prevSet.delete(id);
							}
						}
						return Array.from(prevSet);
					});
				},
				onToggleOne: (id, checked) => {
					setSelectedInvoiceIds((prev) => {
						const prevSet = new Set(prev);
						if (checked) prevSet.add(id);
						else prevSet.delete(id);
						return Array.from(prevSet);
					});
				},
			}),
		[allSelected, partiallySelected, selectedIdSet, visibleIds],
	);

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1">
						<Icon icon="mdi:file-document-outline" />
						Invoice
					</Button>
					<Text variant="body2" className="text-muted-foreground">
						{activeInvoiceLabel ? `${activeInvoiceLabel} selected` : "Manage customer invoices"}
					</Text>
				</div>
				<div className="flex items-center gap-2">
					{selectedInvoiceIds.length > 0 && (
						<Text variant="body2" className="text-muted-foreground">
							Selected: {selectedInvoiceIds.length}
						</Text>
					)}
					<SplitButton
						size="sm"
						mainAction={{
							label: (
								<span className="flex items-center gap-2">
									<Icon icon="mdi:plus" />
									Create Invoice
								</span>
							),
							disabled: selectedInvoiceIds.length === 0,
							onClick: () => {
								if (selectedInvoiceIds.length === 0) {
									toast.error("Please select at least one row");
									return;
								}
								navigate("/dashboard/invoice/create", {
									state: { selectedInvoiceIds, mode: "standard" },
								});
							},
						}}
						options={[
							{
								label: "Create and open draft",
								disabled: selectedInvoiceIds.length === 0,
								onClick: () => {
									if (selectedInvoiceIds.length === 0) return;
									navigate("/dashboard/invoice/create", {
										state: { selectedInvoiceIds, mode: "draft" },
									});
								},
							},
							{
								label: "Create and clear selection",
								disabled: selectedInvoiceIds.length === 0,
								onClick: () => {
									if (selectedInvoiceIds.length === 0) return;
									navigate("/dashboard/invoice/create", {
										state: { selectedInvoiceIds, mode: "clear" },
									});
									setSelectedInvoiceIds([]);
								},
							},
						]}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
				{summaryCards.map((card) => (
					<SummaryStatCard key={card.label} {...card} />
				))}
			</div>

			<SmartDataTable
				className="flex-1 min-h-0"
				maxBodyHeight="100%"
				data={pagedData}
				columns={columns}
				filterConfig={{
					typeOptions: INVOICE_FILTER_TYPE_OPTIONS,
					fieldOptions: INVOICE_FILTER_FIELD_OPTIONS,
					typeValue: typeFilter,
					fieldValue: fieldFilter,
					searchValue,
					onTypeChange: onTypeFilterChange,
					onFieldChange: onFieldFilterChange,
					onSearchChange,
				}}
				paginationConfig={{
					page: currentPage,
					pageSize,
					totalItems,
					totalPages,
					paginationItems,
					onPageChange,
					onPageSizeChange,
				}}
			/>
		</div>
	);
}
