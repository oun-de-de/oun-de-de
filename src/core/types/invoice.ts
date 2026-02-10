export type InvoiceStatus = "Draft" | "Pending" | "Paid" | "Overdue";

export type InvoiceRow = {
	id: string;
	date: string;
	refNo: string;
	customer: string;
	dueDate: string;
	status: InvoiceStatus;
	total: number;
	paid: number;
	balance: number;
};

export type CreateInvoiceMode = "standard" | "draft" | "clear";

export type CreateInvoiceLocationState = {
	selectedInvoiceIds?: string[];
	mode?: CreateInvoiceMode;
};

export type InvoiceSaveMode = "draft" | "final";

export type InvoiceDraftForm = {
	invoiceDate: string;
	dueDate: string;
	memo: string;
};

export type SelectedInvoiceRow = InvoiceRow;
