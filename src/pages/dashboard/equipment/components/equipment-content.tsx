import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { SmartDataTable, SummaryStatCard } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import type { EquipmentItemId } from "@/core/types/equipment";
import { Badge } from "@/core/ui/badge";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";
import { buildPagination } from "@/core/utils/dashboard-utils";
import { useRouter } from "@/routes/hooks/use-router";
import { EQUIPMENT_ITEMS } from "../constants/constants";
import { useEquipmentActions, useEquipmentState } from "../stores/equipment-store";
import { createItemMap, getRemainingAfterByTxId, getSortedTransactionsDesc, getSummaryRows } from "../utils/utils";
import { StockInForm } from "./stock-in-form";
import { StockOutBorrowForm } from "./stock-out-borrow-form";
import { filterRows, mapTransactionsToRows, paginateRows, transactionColumns } from "./transaction-columns";

type Props = {
	activeItemId: EquipmentItemId | null;
};

export function EquipmentContent({ activeItemId }: Props) {
	const router = useRouter();
	const {
		transactions,
		stockInQty,
		stockInNote,
		borrowQty,
		borrowCustomer,
		tableTypeFilter,
		tableFieldFilter,
		tableSearchValue,
		tablePage,
		tablePageSize,
	} = useEquipmentState();
	const {
		setStockInItemId,
		setStockInQty,
		setStockInNote,
		setBorrowItemId,
		setBorrowQty,
		setBorrowCustomer,
		setTableTypeFilter,
		setTableFieldFilter,
		setTableSearchValue,
		setTablePage,
		setTablePageSize,
		addStockInTransaction,
		addBorrowStockOutTransaction,
	} = useEquipmentActions();

	const itemMap = useMemo(() => createItemMap(EQUIPMENT_ITEMS), []);
	const remainingAfterByTxId = useMemo(() => getRemainingAfterByTxId(EQUIPMENT_ITEMS, transactions), [transactions]);
	const summaryRows = useMemo(() => getSummaryRows(EQUIPMENT_ITEMS, transactions), [transactions]);
	const sortedTransactions = useMemo(() => getSortedTransactionsDesc(transactions), [transactions]);

	// Filter by active item
	const activeItem = activeItemId ? EQUIPMENT_ITEMS.find((item) => item.id === activeItemId) : null;
	const filteredSummary = activeItem ? summaryRows.filter((row) => row.item.id === activeItemId) : summaryRows;
	const filteredTransactions = activeItemId
		? sortedTransactions.filter((tx) => tx.itemId === activeItemId)
		: sortedTransactions;

	// Build summary stat cards
	const summaryCards = useMemo(() => {
		const totalStockIn = filteredSummary.reduce((sum, row) => sum + row.stockIn, 0);
		const totalStockOut = filteredSummary.reduce((sum, row) => sum + row.stockOut, 0);
		const totalRemaining = filteredSummary.reduce((sum, row) => sum + row.remaining, 0);

		return [
			{ label: "Stock In", value: totalStockIn, color: "bg-blue-500", icon: "mdi:package-variant-plus" },
			{ label: "Stock Out", value: totalStockOut, color: "bg-orange-500", icon: "mdi:package-variant-minus" },
			{ label: "Remaining", value: totalRemaining, color: "bg-green-500", icon: "mdi:package-variant" },
		];
	}, [filteredSummary]);

	// Transaction table rows
	const allRows = useMemo(
		() => mapTransactionsToRows(filteredTransactions, itemMap, remainingAfterByTxId),
		[filteredTransactions, itemMap, remainingAfterByTxId],
	);
	const filteredRows = useMemo(
		() => filterRows(allRows, tableTypeFilter, tableFieldFilter, tableSearchValue),
		[allRows, tableTypeFilter, tableFieldFilter, tableSearchValue],
	);
	const { pagedRows, totalItems, totalPages, currentPage } = useMemo(
		() => paginateRows(filteredRows, tablePage, tablePageSize),
		[filteredRows, tablePage, tablePageSize],
	);

	const addStockIn = useCallback(() => {
		const result = addStockInTransaction();
		if (!result.success) {
			toast.error(result.error);
			return;
		}
		toast.success("Stock in added");
	}, [addStockInTransaction]);

	const addBorrowStockOut = useCallback(() => {
		const result = addBorrowStockOutTransaction();
		if (!result.success) {
			toast.error(result.error);
			return;
		}
		toast.success(`Borrow stock out saved (${result.slipNo})`);
	}, [addBorrowStockOutTransaction]);

	const columns = useMemo(() => transactionColumns(), []);

	const handleRowClick = useCallback(
		(row: (typeof pagedRows)[number]) => {
			const itemId = filteredTransactions.find((tx) => tx.id === row.id)?.itemId;
			if (itemId) {
				router.push(`/dashboard/equipment/${itemId}`);
			}
		},
		[router, filteredTransactions],
	);

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1">
						<Icon icon="mdi:toolbox-outline" />
						Equipment
					</Button>
					<Text variant="body2" className="text-slate-400">
						{activeItem ? `${activeItem.name} selected` : "All equipment"}
					</Text>
				</div>
				<div className="flex gap-2">
					<Button size="sm" className="gap-2" variant="outline">
						<Icon icon="mdi:printer" />
						Print Report
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
				{summaryCards.map((card) => (
					<SummaryStatCard key={card.label} {...card} />
				))}
			</div>

			{activeItem && (
				<div className="space-y-4 rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<Text variant="body1" className="font-semibold">
							{activeItem.name} — Detail
						</Text>
						<Badge variant={filteredSummary[0]?.isLowStock ? "warning" : "success"}>
							{filteredSummary[0]?.isLowStock ? "Low Stock" : "Normal"}
						</Badge>
					</div>

					<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
						<StockInForm
							items={EQUIPMENT_ITEMS}
							itemId={activeItem.id}
							quantity={stockInQty}
							note={stockInNote}
							onItemChange={setStockInItemId}
							onQuantityChange={setStockInQty}
							onNoteChange={setStockInNote}
							onSubmit={addStockIn}
						/>

						<StockOutBorrowForm
							items={EQUIPMENT_ITEMS}
							itemId={activeItem.id}
							quantity={borrowQty}
							customerName={borrowCustomer}
							onItemChange={setBorrowItemId}
							onQuantityChange={setBorrowQty}
							onCustomerNameChange={setBorrowCustomer}
							onSubmit={addBorrowStockOut}
						/>
					</div>
				</div>
			)}

			<SmartDataTable
				className="flex-1 min-h-0"
				maxBodyHeight="100%"
				data={pagedRows}
				columns={columns}
				onRowClick={handleRowClick}
				filterConfig={{
					typeOptions: [
						{ value: "all", label: "All Type" },
						{ value: "stock-in", label: "Stock In" },
						{ value: "stock-out-borrow", label: "Stock Out (Borrow)" },
					],
					fieldOptions: [
						{ value: "item", label: "Item" },
						{ value: "customer", label: "Customer" },
						{ value: "slipNo", label: "Slip No" },
						{ value: "note", label: "Note" },
					],
					typeValue: tableTypeFilter,
					fieldValue: tableFieldFilter,
					searchValue: tableSearchValue,
					onTypeChange: setTableTypeFilter,
					onFieldChange: setTableFieldFilter,
					onSearchChange: setTableSearchValue,
					searchPlaceholder: "Search transaction",
				}}
				paginationConfig={{
					page: currentPage,
					pageSize: tablePageSize,
					totalItems,
					totalPages,
					paginationItems: buildPagination(currentPage, totalPages),
					onPageChange: setTablePage,
					onPageSizeChange: setTablePageSize,
				}}
			/>
		</>
	);
}
