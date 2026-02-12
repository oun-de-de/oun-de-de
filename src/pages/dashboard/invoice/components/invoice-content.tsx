import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { SmartDataTable, SummaryStatCard } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import type { SummaryStatCardData } from "@/core/types/common";
import type { Invoice, InvoiceExportPreviewRow } from "@/core/types/invoice";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";
import {
	INVOICE_FILTER_FIELD_OPTIONS,
	INVOICE_FILTER_TYPE_OPTIONS,
	INVOICE_TYPE_OPTIONS,
} from "../constants/constants";
import { getInvoiceColumns } from "./invoice-columns";

type InvoiceContentProps = {
	pagedData: Invoice[];
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
	sorting: SortingState;
	onSortingChange: OnChangeFn<SortingState>;
	isLoading?: boolean;
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
	sorting,
	onSortingChange,
	isLoading,
}: InvoiceContentProps) {
	const navigate = useNavigate();
	const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
	const [selectedInvoiceById, setSelectedInvoiceById] = useState<Record<string, Invoice>>({});
	const selectedIdSet = useMemo(() => new Set(selectedInvoiceIds), [selectedInvoiceIds]);
	const visibleIds = useMemo(() => pagedData.map((row) => row.id), [pagedData]);
	const rowById = useMemo(() => new Map(pagedData.map((row) => [row.id, row])), [pagedData]);
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
					if (checked) {
						setSelectedInvoiceById((prev) => {
							const next = { ...prev };
							for (const row of pagedData) {
								next[row.id] = row;
							}
							return next;
						});
						return;
					}
					setSelectedInvoiceById((prev) => {
						const next = { ...prev };
						for (const id of visibleIds) {
							delete next[id];
						}
						return next;
					});
				},
				onToggleOne: (id, checked) => {
					setSelectedInvoiceIds((prev) => {
						const prevSet = new Set(prev);
						if (checked) prevSet.add(id);
						else prevSet.delete(id);
						return Array.from(prevSet);
					});
					if (checked) {
						const row = rowById.get(id);
						if (row) {
							setSelectedInvoiceById((prev) => ({ ...prev, [id]: row }));
						}
						return;
					}
					setSelectedInvoiceById((prev) => {
						const next = { ...prev };
						delete next[id];
						return next;
					});
				},
			}),
		[allSelected, pagedData, partiallySelected, rowById, selectedIdSet, visibleIds],
	);

	const handleOpenExportPreview = () => {
		if (selectedInvoiceIds.length === 0) return;

		const previewRows: InvoiceExportPreviewRow[] = selectedInvoiceIds.map((id) => {
			const row = selectedInvoiceById[id] ?? rowById.get(id);
			return {
				refNo: row?.refNo ?? id,
				customerName: row?.customerName ?? "-",
				date: row?.date ?? "",
				productName: null,
				unit: null,
				pricePerProduct: null,
				quantityPerProduct: null,
				quantity: null,
				amount: null,
				total: null,
				memo: null,
				paid: null,
				balance: null,
			};
		});

		navigate("/dashboard/invoice/export-preview", {
			state: {
				selectedInvoiceIds,
				previewRows,
			},
		});
	};

	return (
		<div className={`flex w-full flex-col gap-4 ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
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
					<Button
						size="sm"
						variant="outline"
						disabled={selectedInvoiceIds.length === 0}
						onClick={handleOpenExportPreview}
					>
						<Icon icon="mdi:file-export-outline" />
						Export
					</Button>
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
					optionsByField: {
						type: INVOICE_TYPE_OPTIONS,
					},
				}}
				sortingConfig={{
					sorting,
					onSortingChange,
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
