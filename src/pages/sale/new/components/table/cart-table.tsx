import type { CellContext } from "@tanstack/react-table";
import { useMemo } from "react";
import { SmartDataTable } from "@/core/components/common/smart-data-table";
import { Icon } from "@/core/components/icon";
import type { SaleProduct } from "@/core/domain/sales/entities/sale-product";
import { cn } from "@/core/utils";
import { formatNumber } from "@/core/utils/formatters";

export interface CartTableProps {
	data?: SaleProduct[];
	className?: string;
}

export function CartTable({ data = [], className }: CartTableProps) {
	const columns = useMemo(
		() => [
			{
				header: "NO",
				id: "no",
				meta: { headerClassName: "w-12", bodyClassName: "text-center" },
				cell: ({ row }: CellContext<SaleProduct, unknown>) => row.index + 1,
			},
			{
				header: "ITEM",
				accessorKey: "name",
				meta: { headerClassName: "w-100" },
			},
			{
				header: "QTY",
				accessorKey: "qty",
			},
			{
				header: "PRICE",
				accessorKey: "price",
				cell: (ctx: CellContext<SaleProduct, number>) => formatNumber(ctx.getValue()),
			},
			{
				header: "AMOUNT",
				accessorKey: "amount",
				cell: (ctx: CellContext<SaleProduct, number>) => formatNumber(ctx.getValue()),
				meta: { headerClassName: "w-60" },
			},
			{
				header: () => <Icon icon="mdi:dots-vertical" size={20} />,
				id: "actions",
				cell: () => null,
				meta: { headerClassName: "w-12" },
			},
		],
		[],
	);

	return <SmartDataTable data={data} columns={columns} className={cn("px-1", className)} />;
}
