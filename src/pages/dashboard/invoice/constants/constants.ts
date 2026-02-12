export const INVOICE_FILTER_TYPE_OPTIONS = [
	{ value: "all", label: "All Status" },
	{ value: "OPEN", label: "Open" },
	{ value: "CLOSED", label: "Closed" },
	{ value: "OVERDUE", label: "Overdue" },
];

export const INVOICE_FILTER_FIELD_OPTIONS = [
	{ value: "all", label: "All Field" },
	// { value: "refNo", label: "Invoice No" },
	// { value: "customerName", label: "Customer" },
	{ value: "type", label: "Type" },
];

export const INVOICE_TYPE_OPTIONS = [
	{ value: "INVOICE", label: "Invoice" },
	{ value: "RECEIPT", label: "Receipt" },
];
