import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { SmartDataTable } from "@/core/components/common";
import Icon from "@/core/components/icon/icon";
import type { Installment } from "@/core/types/loan";
import { Badge } from "@/core/ui/badge";
import { Button } from "@/core/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/core/ui/dialog";
import { Text } from "@/core/ui/typography";

type InstallmentsTableProps = {
	installments: Installment[];
	onPay: (installmentId: string) => void;
	isPayPending?: boolean;
};

function isPayableStatus(status: Installment["status"]) {
	const normalizedStatus = status.toLowerCase();
	return normalizedStatus === "unpaid" || normalizedStatus === "overdue";
}

export function InstallmentsTable({ installments, onPay, isPayPending }: InstallmentsTableProps) {
	const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);

	const columns = useMemo<ColumnDef<Installment>[]>(
		() => [
			{
				accessorKey: "monthIndex",
				size: 80,
				header: "Inst. No.",
				cell: ({ row }) => <span className="font-mono">{row.original.monthIndex}</span>,
				meta: { bodyClassName: "text-center" },
			},
			{
				accessorKey: "dueDate",
				header: "Due Date",
				cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
			},
			{
				accessorKey: "amount",
				header: "Amount",
				cell: ({ row }) => row.original.amount.toLocaleString(),
				meta: { bodyClassName: "text-right" },
			},
			{
				accessorKey: "status",
				header: "Status",
				size: 100,
				cell: ({ row }) => {
					const normalizedStatus = row.original.status.toLowerCase();
					return (
						<Badge variant={normalizedStatus === "paid" ? "success" : "destructive"}>
							{normalizedStatus.toUpperCase()}
						</Badge>
					);
				},
				meta: { bodyClassName: "text-center" },
			},
			{
				accessorKey: "paidAt",
				header: "Paid At",
				cell: ({ row }) => (row.original.paidAt ? new Date(row.original.paidAt).toLocaleDateString() : "-"),
			},
			{
				id: "action",
				header: "Action",
				cell: ({ row }) => {
					if (!isPayableStatus(row.original.status)) return null;
					return (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSelectedInstallment(row.original)}
							disabled={isPayPending}
						>
							<Icon icon="mdi:cash" className="mr-1" />
							{isPayPending ? "..." : "Pay"}
						</Button>
					);
				},
				meta: { bodyClassName: "text-center" },
			},
		],
		[isPayPending],
	);

	if (installments.length === 0) {
		return (
			<div className="flex items-center justify-center py-12 text-slate-400">
				<Text variant="body2">No installments found</Text>
			</div>
		);
	}

	return (
		<>
			<SmartDataTable className="flex-1 min-h-0 h-fit" maxBodyHeight="100%" data={installments} columns={columns} />
			<Dialog open={!!selectedInstallment} onOpenChange={(open) => (!open ? setSelectedInstallment(null) : undefined)}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Confirm Installment Payment</DialogTitle>
					</DialogHeader>
					<div className="space-y-1 text-sm text-slate-600">
						<p>Installment: {selectedInstallment?.monthIndex ?? "-"}</p>
						<p>Amount: {selectedInstallment?.amount?.toLocaleString() ?? "-"}</p>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setSelectedInstallment(null)} disabled={isPayPending}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								if (!selectedInstallment) return;
								onPay(selectedInstallment.id);
								setSelectedInstallment(null);
							}}
							disabled={isPayPending}
						>
							{isPayPending ? "Paying..." : "Confirm"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
