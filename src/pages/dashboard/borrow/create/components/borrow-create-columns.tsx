import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/core/ui/button";

export type Equipment = {
	id: string;
	code: string;
	name: string;
	category: string;
	inStock: number;
	price: number;
};

export const getBorrowCreateColumns = (onAddToCart: (item: Equipment) => void): ColumnDef<Equipment>[] => [
	{ accessorKey: "code", header: "Code" },
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ getValue }) => (
			<span className="font-semibold text-blue-600 hover:underline cursor-pointer">{getValue() as string}</span>
		),
	},
	{ accessorKey: "category", header: "Category" },
	{
		accessorKey: "inStock",
		header: "Stock",
		cell: ({ getValue }) => <span className="text-gray-600">{getValue() as number}</span>,
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ getValue }) => <span className="font-medium text-gray-900">${getValue() as number}</span>,
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<Button
				type="button"
				size="sm"
				onClick={() => onAddToCart(row.original)}
				className="h-7 px-4 text-[11px] uppercase font-bold bg-blue-500 hover:bg-blue-600 text-white tracking-wide rounded-sm shadow-sm"
			>
				Select
			</Button>
		),
	},
];
