import type { ColumnDef } from "@tanstack/react-table";
import type { EquipmentItem, EquipmentItemId, EquipmentTransaction } from "@/core/types/equipment";
import { Badge } from "@/core/ui/badge";
import { Button } from "@/core/ui/button";
import { formatDateTime } from "../utils/utils";

export type EquipmentTransactionRow = {
	id: string;
	date: string;
	item: string;
	type: "Stock In" | "Stock Out (Borrow)";
	qtyIn: string;
	qtyOut: string;
	remaining: number;
	customer: string;
	slipNo: string;
	note: string;
};

export function mapTransactionsToRows(
	transactions: EquipmentTransaction[],
	itemMap: Map<EquipmentItemId, EquipmentItem>,
	remainingAfterByTxId: Map<string, number>,
): EquipmentTransactionRow[] {
	return transactions.map((tx) => {
		const item = itemMap.get(tx.itemId);
		const isStockIn = tx.type === "stock-in";
		return {
			id: tx.id,
			date: formatDateTime(tx.createdAt),
			item: item?.name ?? tx.itemId,
			type: isStockIn ? "Stock In" : "Stock Out (Borrow)",
			qtyIn: isStockIn ? String(tx.quantity) : "-",
			qtyOut: isStockIn ? "-" : String(tx.quantity),
			remaining: remainingAfterByTxId.get(tx.id) ?? 0,
			customer: tx.customerName ?? "-",
			slipNo: tx.slipNo ?? "-",
			note: tx.note ?? "-",
		};
	});
}

export function filterRows(
	rows: EquipmentTransactionRow[],
	typeFilter: string,
	fieldFilter: string,
	searchValue: string,
): EquipmentTransactionRow[] {
	const normalized = searchValue.trim().toLowerCase();
	return rows.filter((row) => {
		if (typeFilter !== "all") {
			const rowType = row.type === "Stock In" ? "stock-in" : "stock-out-borrow";
			if (rowType !== typeFilter) return false;
		}

		if (!normalized) return true;

		if (fieldFilter === "item") return row.item.toLowerCase().includes(normalized);
		if (fieldFilter === "customer") return row.customer.toLowerCase().includes(normalized);
		if (fieldFilter === "slipNo") return row.slipNo.toLowerCase().includes(normalized);
		if (fieldFilter === "note") return row.note.toLowerCase().includes(normalized);

		return (
			row.item.toLowerCase().includes(normalized) ||
			row.customer.toLowerCase().includes(normalized) ||
			row.slipNo.toLowerCase().includes(normalized) ||
			row.note.toLowerCase().includes(normalized)
		);
	});
}

export function paginateRows(
	rows: EquipmentTransactionRow[],
	page: number,
	pageSize: number,
): {
	pagedRows: EquipmentTransactionRow[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
} {
	const totalItems = rows.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * pageSize;
	return {
		pagedRows: rows.slice(start, start + pageSize),
		totalItems,
		totalPages,
		currentPage,
	};
}

export function transactionColumns(): ColumnDef<EquipmentTransactionRow>[] {
	return [
		{ accessorKey: "date", header: "Date" },
		{ accessorKey: "item", header: "Item" },
		{
			accessorKey: "type",
			header: "Type",
			cell: ({ row }) => (
				<Badge variant={row.original.type === "Stock In" ? "info" : "secondary"}>{row.original.type}</Badge>
			),
		},
		{ accessorKey: "qtyIn", header: "Qty In" },
		{ accessorKey: "qtyOut", header: "Qty Out" },
		{ accessorKey: "remaining", header: "Remaining" },
		{ accessorKey: "customer", header: "Customer" },
		{ accessorKey: "slipNo", header: "Slip No" },
		{ accessorKey: "note", header: "Note" },
		{
			id: "action",
			header: "Action",
			cell: ({ row }) =>
				row.original.type === "Stock Out (Borrow)" ? (
					<Button variant="outline" size="sm">
						Print Slip
					</Button>
				) : (
					"-"
				),
		},
	];
}
