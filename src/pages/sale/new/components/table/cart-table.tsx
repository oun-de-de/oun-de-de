import { SmartDataTable } from "@/core/components/common/smart-data-table";
import { useMemo } from "react";
import { CellContext } from "@tanstack/react-table";
import { Icon } from "@/core/components/icon";
import { cn } from "@/core/utils";

export interface CartTableItem {
	id: string | number;
	no: number;
	item: string;
	qty: number;
	price: number;
	amount: number;
}

export interface CartTableProps {
	data?: CartTableItem[];
	className?: string;
}

export function CartTable({ data = [], className }: CartTableProps) {
	const columns = useMemo(
		() => [
			{
				header: "NO",
				accessorKey: "no",
				meta: { headerClassName: "w-12" },
			},
			{
				header: "ITEM",
				accessorKey: "item",
				meta: { headerClassName: "w-100" },
			},
			{
				header: "QTY",
				accessorKey: "qty",
			},
			{
				header: "PRICE",
				accessorKey: "price",
				cell: (ctx: CellContext<CartTableItem, number>) => ctx.getValue()?.toLocaleString(),
			},
			{
				header: "AMOUNT",
				accessorKey: "amount",
				cell: (ctx: CellContext<CartTableItem, number>) => ctx.getValue()?.toLocaleString(),
				meta: { headerClassName: "w-60" },
			},
			{
				header: () => <Icon icon="mdi:dots-vertical" size={20} />, // dùng icon dots
				id: "actions",
				cell: () => null,
				meta: { headerClassName: "w-12" },
			},
		],
		[],
	);

	return <SmartDataTable data={data} columns={columns} className={cn("px-1", className)} />;
}
