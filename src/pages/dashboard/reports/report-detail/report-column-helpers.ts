import type { ReportTemplateColumn } from "../components/layout/report-template-table";

type ColumnAlign = "left" | "center" | "right";

function createColumn(
	id: string,
	header: string,
	align: ColumnAlign = "left",
	className?: string,
): ReportTemplateColumn {
	return {
		id,
		header,
		cell: ({ row }) => row.original.cells[id],
		meta: className ? { align, className, headerClassName: className } : { align },
	};
}

export type SizedColumnConfig = readonly [id: string, header: string, className?: string, align?: ColumnAlign];

export function buildSizedColumns(configs: SizedColumnConfig[]): ReportTemplateColumn[] {
	return configs.map(([id, header, className, align = "left"]) => createColumn(id, header, align, className));
}
