import type { ColumnDef } from "@tanstack/react-table";
import { Icon } from "@/core/components/icon";
import type { InvoiceRow } from "@/core/types/invoice";
import { Badge } from "@/core/ui/badge";
import { Button } from "@/core/ui/button";
import { Checkbox } from "@/core/ui/checkbox";
import { getStatusVariant } from "@/core/utils/get-status-variant";

type InvoiceColumnsOptions = {
	allSelected: boolean;
	partiallySelected: boolean;
	selectedIds: Set<string>;
	onToggleAll: (checked: boolean) => void;
	onToggleOne: (id: string, checked: boolean) => void;
};

export function getInvoiceColumns({
	allSelected,
	partiallySelected,
	selectedIds,
	onToggleAll,
	onToggleOne,
}: InvoiceColumnsOptions): ColumnDef<InvoiceRow>[] {
	return [
		{
			id: "select",
			size: 48,
			meta: { bodyClassName: "text-center" },
			header: () => (
				<Checkbox
					checked={allSelected ? true : partiallySelected ? "indeterminate" : false}
					onCheckedChange={(checked) => onToggleAll(checked === true)}
					aria-label="Select all invoices"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={selectedIds.has(row.original.id)}
					onCheckedChange={(checked) => onToggleOne(row.original.id, checked === true)}
					aria-label={`Select invoice ${row.original.refNo}`}
				/>
			),
		},
		{
			header: "Date",
			accessorKey: "date",
			size: 100,
			meta: { bodyClassName: "text-center" },
		},
		{
			header: "Invoice No",
			accessorKey: "refNo",
			size: 140,
			cell: ({ row }) => <span className="font-medium text-sky-600">{row.original.refNo}</span>,
		},
		{
			header: "Customer",
			accessorKey: "customer",
		},
		{
			header: "Due Date",
			accessorKey: "dueDate",
			size: 100,
			meta: { bodyClassName: "text-center" },
		},
		{
			header: "Status",
			accessorKey: "status",
			size: 90,
			meta: { bodyClassName: "text-center" },
			cell: ({ row }) => {
				const status = row.original.status;
				return (
					<Badge variant={getStatusVariant(status)} className="w-full">
						{status}
					</Badge>
				);
			},
		},
		{
			header: "Total",
			accessorKey: "total",
			size: 110,
			meta: { bodyClassName: "text-right" },
			cell: ({ row }) => row.original.total.toLocaleString(),
		},
		{
			header: "Paid",
			accessorKey: "paid",
			size: 110,
			meta: { bodyClassName: "text-right" },
			cell: ({ row }) => row.original.paid.toLocaleString(),
		},
		{
			header: "Balance",
			accessorKey: "balance",
			size: 110,
			meta: { bodyClassName: "text-right" },
			cell: ({ row }) => <span className="font-semibold">{row.original.balance.toLocaleString()}</span>,
		},
		{
			header: "Actions",
			id: "actions",
			size: 80,
			meta: { bodyClassName: "text-center" },
			cell: () => (
				<Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
					<Icon icon="mdi:pencil" />
				</Button>
			),
		},
	];
}
