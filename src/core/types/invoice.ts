export type InvoiceStatus = "OPEN" | "CLOSED" | "OVERDUE";
export type InvoiceType = "INVOICE" | "RECEIPT";

export interface Invoice {
	id: string;
	refNo: string;
	customerName: string;
	date: string;
	type: InvoiceType;
	status: InvoiceStatus;
}

export interface InvoiceExportPreviewRow {
	refNo: string;
	customerName: string;
	date: string;
	productName: string | null;
	unit: string | null;
	pricePerProduct: number | null;
	quantityPerProduct: number | null;
	quantity: number | null;
	amount: number | null;
	total: number | null;
	memo: string | null;
	paid: number | null;
	balance: number | null;
}

export interface InvoiceExportPreviewLocationState {
	selectedInvoiceIds: string[];
	previewRows: InvoiceExportPreviewRow[];
}
