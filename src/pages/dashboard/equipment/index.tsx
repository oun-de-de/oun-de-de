import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import Icon from "@/core/components/icon/icon";
import { Button } from "@/core/ui/button";
import { Text } from "@/core/ui/typography";
import { StockInForm } from "./components/stock-in-form";
import { StockOutBorrowForm } from "./components/stock-out-borrow-form";
import { StockSummary } from "./components/stock-summary";
import { TransactionTable } from "./components/transaction-table";
import { EQUIPMENT_ITEMS } from "./constants/constants";
import { useEquipmentActions, useEquipmentState } from "./stores/equipment-store";
import { createItemMap, getRemainingAfterByTxId, getSortedTransactionsDesc, getSummaryRows } from "./utils/utils";

export default function EquipmentCenterPage() {
	const {
		transactions,
		stockInItemId,
		stockInQty,
		stockInNote,
		borrowItemId,
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

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<Button size="sm" className="gap-1">
						<Icon icon="mdi:toolbox-outline" />
						Equipment
					</Button>
					<Text variant="body2" className="text-muted-foreground">
						Stock in, stock out, remaining and borrowing slips
					</Text>
				</div>
				<div className="flex gap-2">
					<Button size="sm" className="gap-2" variant="outline">
						<Icon icon="mdi:printer" />
						Print Report
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
				<StockInForm
					items={EQUIPMENT_ITEMS}
					itemId={stockInItemId}
					quantity={stockInQty}
					note={stockInNote}
					onItemChange={setStockInItemId}
					onQuantityChange={setStockInQty}
					onNoteChange={setStockInNote}
					onSubmit={addStockIn}
				/>

				<StockOutBorrowForm
					items={EQUIPMENT_ITEMS}
					itemId={borrowItemId}
					quantity={borrowQty}
					customerName={borrowCustomer}
					onItemChange={setBorrowItemId}
					onQuantityChange={setBorrowQty}
					onCustomerNameChange={setBorrowCustomer}
					onSubmit={addBorrowStockOut}
				/>

				<StockSummary rows={summaryRows} />
			</div>

			<TransactionTable
				transactions={sortedTransactions}
				itemMap={itemMap}
				remainingAfterByTxId={remainingAfterByTxId}
				typeFilter={tableTypeFilter}
				fieldFilter={tableFieldFilter}
				searchValue={tableSearchValue}
				page={tablePage}
				pageSize={tablePageSize}
				onTypeFilterChange={setTableTypeFilter}
				onFieldFilterChange={setTableFieldFilter}
				onSearchValueChange={setTableSearchValue}
				onPageChange={setTablePage}
				onPageSizeChange={setTablePageSize}
			/>
		</div>
	);
}
