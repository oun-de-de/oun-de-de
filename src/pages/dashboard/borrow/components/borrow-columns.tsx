import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/core/ui/badge";
import { getStatusVariant } from "@/core/utils/get-status-variant";
import type { BorrowerType } from "../../../../core/types/loan";

export type BorrowRow = {
	id: string;
	refNo: string;
	borrower: string;
	borrowerType: BorrowerType;
	startDate: string;
	loanAmount: string;
	monthlyPayment: string;
	plannedMonths: number;
	paidMonths: number;
	missedMonths: number;
	adjustedMonths: number;
	remainingAmount: string;
	status: "Active" | "Returned" | "Overdue";
};

export const borrowColumns: ColumnDef<BorrowRow>[] = [
	{ accessorKey: "refNo", header: "Ref No" },
	{ accessorKey: "borrower", header: "Borrower" },
	{
		accessorKey: "borrowerType",
		header: "Type",
		cell: ({ row }) => (
			<Badge variant={row.original.borrowerType === "Employee" ? "info" : "secondary"} shape="square">
				{row.original.borrowerType}
			</Badge>
		),
	},
	{ accessorKey: "startDate", header: "Start Date" },
	{ accessorKey: "loanAmount", header: "Loan Amount" },
	{ accessorKey: "monthlyPayment", header: "Monthly Pay" },
	{ accessorKey: "plannedMonths", header: "Plan (Month)" },
	{ accessorKey: "paidMonths", header: "Paid (Month)" },
	{ accessorKey: "missedMonths", header: "Missed (Month)" },
	{ accessorKey: "adjustedMonths", header: "Adjusted (Month)" },
	{ accessorKey: "remainingAmount", header: "Remaining" },
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ getValue }) => {
			const status = getValue() as string;
			const variant = getStatusVariant(status);
			return (
				<Badge variant={variant} shape="square">
					{status}
				</Badge>
			);
		},
	},
];
