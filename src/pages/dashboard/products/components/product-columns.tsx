import type { ColumnDef } from "@tanstack/react-table";
import Icon from "@/core/components/icon/icon";
import type { Product } from "@/core/types/product";
import { Button } from "@/core/ui/button";

export const columns: ColumnDef<Product>[] = [
	{
		header: "Date",
		size: 80,
		accessorKey: "date",
		cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
	},
	{
		header: "Ref No",
		accessorKey: "refNo",
		cell: ({ row }) => <span className="text-sky-600">{row.original.refNo}</span>,
	},
	{
		header: "Name",
		accessorKey: "name",
	},
	{
		header: "Unit",
		size: 80,
		id: "unit",
		cell: ({ row }) => row.original.unit?.name || "-",
	},
	{
		header: "Quantity",
		size: 80,
		accessorKey: "quantity",
		meta: { bodyClassName: "text-right" },
	},
	{
		header: "Cost",
		size: 70,
		accessorKey: "cost",
		cell: ({ row }) => (row.original.cost || 0).toLocaleString(),
		meta: { bodyClassName: "text-right" },
	},
	{
		header: "Price",
		size: 70,
		accessorKey: "price",
		cell: ({ row }) => <span className="font-semibold">{(row.original.price || 0).toLocaleString()}</span>,
		meta: { bodyClassName: "text-right" },
	},
	{
		header: "Default Qty",
		size: 90,
		id: "defaultQuantity",
		cell: ({ row }) =>
			row.original.defaultProductSetting?.quantity !== null &&
			row.original.defaultProductSetting?.quantity !== undefined
				? row.original.defaultProductSetting.quantity
				: "-",
		meta: { bodyClassName: "text-right" },
	},
	{
		header: "Default Price",
		size: 100,
		id: "defaultPrice",
		cell: ({ row }) => {
			const price = row.original.defaultProductSetting?.price;
			return price !== null && price !== undefined ? Number(price).toLocaleString() : "-";
		},
		meta: { bodyClassName: "text-right" },
	},
	{
		header: "Actions",
		size: 80,
		id: "actions",
		cell: () => (
			<div className="flex gap-1">
				<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
					<Icon icon="mdi:pencil" />
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
					<Icon icon="mdi:delete" />
				</Button>
			</div>
		),
	},
];
