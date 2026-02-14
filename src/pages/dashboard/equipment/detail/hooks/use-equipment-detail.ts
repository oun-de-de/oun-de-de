import { useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import type { EquipmentItemId } from "@/core/types/equipment";
import {
	filterRows,
	mapTransactionsToRows,
	paginateRows,
	transactionColumns,
} from "../../components/transaction-columns";
import { EQUIPMENT_ITEMS } from "../../constants/constants";
import { useEquipmentActions, useEquipmentState } from "../../stores/equipment-store";
import { createItemMap, getRemainingAfterByTxId, getSortedTransactionsDesc, getSummaryRows } from "../../utils/utils";

export function useEquipmentDetail() {
	const { id } = useParams<{ id: EquipmentItemId }>();

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

	// Derived data
	const itemMap = useMemo(() => createItemMap(EQUIPMENT_ITEMS), []);
	const remainingAfterByTxId = useMemo(() => getRemainingAfterByTxId(EQUIPMENT_ITEMS, transactions), [transactions]);
	const summaryRows = useMemo(() => getSummaryRows(EQUIPMENT_ITEMS, transactions), [transactions]);
	const sortedTransactions = useMemo(() => getSortedTransactionsDesc(transactions), [transactions]);

	// Find the active item
	const activeItem = id ? EQUIPMENT_ITEMS.find((item) => item.id === id) : null;

	// Filter by active item
	const filteredSummary = activeItem ? summaryRows.filter((row) => row.item.id === id) : [];
	const filteredTransactions = activeItem ? sortedTransactions.filter((tx) => tx.itemId === id) : [];

	// Transaction table
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

	const columns = useMemo(() => transactionColumns(), []);

	// Actions with toast
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

	return {
		// Item data
		activeItem,
		filteredSummary,

		// Form state
		stockInQty,
		stockInNote,
		borrowQty,
		borrowCustomer,

		// Form setters
		setStockInItemId,
		setStockInQty,
		setStockInNote,
		setBorrowItemId,
		setBorrowQty,
		setBorrowCustomer,

		// Form actions
		addStockIn,
		addBorrowStockOut,

		// Table data
		columns,
		pagedRows,
		currentPage,
		totalItems,
		totalPages,

		// Table filters
		tableTypeFilter,
		tableFieldFilter,
		tableSearchValue,
		tablePageSize,
		setTableTypeFilter,
		setTableFieldFilter,
		setTableSearchValue,
		setTablePage,
		setTablePageSize,
	};
}
