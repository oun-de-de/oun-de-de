import { customerTransactions } from "@/_mock/data/dashboard";
import type { InvoiceRow } from "@/core/types/invoice";

export const INVOICE_ROWS: InvoiceRow[] = customerTransactions.slice(0, 12).map((item, index) => {
	const statusMap: InvoiceRow["status"][] = ["Paid", "Pending", "Overdue", "Draft"];
	const status = statusMap[index % statusMap.length];
	const paidMap = {
		Paid: item.amount,
		Pending: Math.round(item.amount * 0.6),
		Overdue: Math.round(item.amount * 0.2),
		Draft: 0,
	} as const;
	const paid = paidMap[status];

	return {
		id: `${item.refNo}-${index}`,
		date: item.date,
		refNo: `IN${item.refNo.slice(2)}`,
		customer: item.customer,
		dueDate: item.date,
		status,
		total: item.amount,
		paid,
		balance: item.amount - paid,
	};
});

export const INVOICE_FILTER_TYPE_OPTIONS = [
	{ value: "all", label: "All Status" },
	{ value: "Draft", label: "Draft" },
	{ value: "Pending", label: "Pending" },
	{ value: "Paid", label: "Paid" },
	{ value: "Overdue", label: "Overdue" },
];

export const INVOICE_FILTER_FIELD_OPTIONS = [
	{ value: "all", label: "All" },
	{ value: "refNo", label: "Invoice No" },
	{ value: "customer", label: "Customer" },
];
