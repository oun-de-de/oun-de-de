import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import { SmartDataTable } from "@/core/components/common";
import type { EquipmentItem, EquipmentItemId, EquipmentTransaction } from "@/core/types/equipment";
import { Badge } from "@/core/ui/badge";
import { Button } from "@/core/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/ui/card";
import { buildPagination } from "@/core/utils/dashboard-utils";
import { formatDateTime } from "../utils/utils";

interface TransactionTableProps {
	transactions: EquipmentTransaction[];
	itemMap: Map<EquipmentItemId, EquipmentItem>;
	remainingAfterByTxId: Map<string, number>;
	typeFilter: string;
	fieldFilter: string;
	searchValue: string;
	page: number;
	pageSize: number;
	onTypeFilterChange: (value: string) => void;
	onFieldFilterChange: (value: string) => void;
	onSearchValueChange: (value: string) => void;
	onPageChange: (value: number) => void;
	onPageSizeChange: (value: number) => void;
}

type EquipmentTransactionRow = {
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

export function TransactionTable({
	transactions,
	itemMap,
	remainingAfterByTxId,
	typeFilter,
	fieldFilter,
	searchValue,
	page,
	pageSize,
	onTypeFilterChange,
	onFieldFilterChange,
	onSearchValueChange,
	onPageChange,
	onPageSizeChange,
}: TransactionTableProps) {
	const rows = useMemo<EquipmentTransactionRow[]>(
		() =>
			transactions.map((tx) => {
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
			}),
		[itemMap, remainingAfterByTxId, transactions],
	);

	const filteredRows = useMemo(() => {
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
	}, [fieldFilter, rows, searchValue, typeFilter]);

	const totalItems = filteredRows.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);

	useEffect(() => {
		if (page > totalPages) {
			onPageChange(totalPages);
		}
	}, [onPageChange, page, totalPages]);

	const pagedRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredRows.slice(start, start + pageSize);
	}, [currentPage, filteredRows, pageSize]);

	const columns = useMemo<ColumnDef<EquipmentTransactionRow>[]>(
		() => [
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
		],
		[],
	);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">In / Out Transaction Table</CardTitle>
				<CardDescription>Borrow stock-out does not trigger low-stock alert.</CardDescription>
			</CardHeader>
			<CardContent>
				<SmartDataTable
					data={pagedRows}
					columns={columns}
					maxBodyHeight="100%"
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
						typeValue: typeFilter,
						fieldValue: fieldFilter,
						searchValue,
						onTypeChange: onTypeFilterChange,
						onFieldChange: onFieldFilterChange,
						onSearchChange: onSearchValueChange,
						searchPlaceholder: "Search transaction",
					}}
					paginationConfig={{
						page: currentPage,
						pageSize,
						totalItems,
						totalPages,
						paginationItems: buildPagination(currentPage, totalPages),
						onPageChange,
						onPageSizeChange,
					}}
				/>
			</CardContent>
		</Card>
	);
}
