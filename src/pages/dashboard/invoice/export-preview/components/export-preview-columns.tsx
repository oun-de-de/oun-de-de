import type { ReportTemplateColumn } from "@/pages/dashboard/reports/components/layout/report-template-table";

function buildColumnMeta(className: string, align?: "left" | "center" | "right") {
	return {
		align,
		className,
		headerClassName: className,
	};
}

export const EXPORT_PREVIEW_COLUMNS: ReportTemplateColumn[] = [
	{
		id: "no",
		header: "NO",
		cell: ({ row }) => row.original.cells.no,
		meta: buildColumnMeta("w-[4%] whitespace-nowrap", "center"),
	},
	{
		id: "refNo",
		header: "REF NO",
		cell: ({ row }) => row.original.cells.refNo,
		meta: buildColumnMeta("w-[10%] break-words", "left"),
	},
	{
		id: "customer",
		header: "CUSTOMER",
		cell: ({ row }) => row.original.cells.customer,
		meta: buildColumnMeta("w-[9%] break-words", "left"),
	},
	{ id: "date", header: "DATE", cell: ({ row }) => row.original.cells.date, meta: buildColumnMeta("w-[8%]", "center") },
	{
		id: "productName",
		header: "PRODUCT NAME",
		cell: ({ row }) => row.original.cells.productName,
		meta: buildColumnMeta("w-[11%] break-words", "left"),
	},
	{
		id: "unit",
		header: "UNIT",
		cell: ({ row }) => row.original.cells.unit,
		meta: buildColumnMeta("w-[5%] whitespace-nowrap", "center"),
	},
	{
		id: "price",
		header: "PRICE",
		cell: ({ row }) => row.original.cells.price,
		meta: buildColumnMeta("w-[7%] whitespace-nowrap", "right"),
	},
	{
		id: "quantity",
		header: "QTY",
		cell: ({ row }) => row.original.cells.quantity,
		meta: buildColumnMeta("w-[6%] whitespace-nowrap", "right"),
	},
	{
		id: "amount",
		header: "AMOUNT",
		cell: ({ row }) => row.original.cells.amount,
		meta: buildColumnMeta("w-[8%] whitespace-nowrap", "right"),
	},
	{
		id: "total",
		header: "TOTAL",
		cell: ({ row }) => row.original.cells.total,
		meta: buildColumnMeta("w-[7%] whitespace-nowrap", "right"),
	},
	{
		id: "received",
		header: "RECEIVED",
		cell: ({ row }) => row.original.cells.received,
		meta: buildColumnMeta("w-[8%] whitespace-nowrap", "right"),
	},
	{
		id: "balance",
		header: "BALANCE",
		cell: ({ row }) => row.original.cells.balance,
		meta: buildColumnMeta("w-[8%] whitespace-nowrap", "right"),
	},
	{
		id: "memo",
		header: "MEMO",
		cell: ({ row }) => row.original.cells.memo,
		meta: buildColumnMeta("w-[9%] break-words", "left"),
	},
];
