import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type React from "react";
import { cn } from "@/core/utils";
import type { ReportSectionVisibility } from "./report-toolbar";

type CellAlign = "left" | "center" | "right";

const alignClass: Record<CellAlign, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export interface ReportTemplateMetaColumn {
	key: string;
	rows: React.ReactNode[];
	align?: CellAlign;
	className?: string;
}

export interface ReportTemplateColumnMeta {
	align?: CellAlign;
	className?: string;
	headerClassName?: string;
}

export type ReportTemplateColumn = ColumnDef<ReportTemplateRow, React.ReactNode> & {
	id: string;
	meta?: ReportTemplateColumnMeta;
};

export interface ReportTemplateSummaryRow {
	key: string;
	label: React.ReactNode;
	value: React.ReactNode;
}

export interface ReportTemplateRow {
	key: string;
	cells: Record<string, React.ReactNode>;
}

interface ReportTemplateTableProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	headerContent?: React.ReactNode;
	metaColumns?: ReportTemplateMetaColumn[];
	columns: ReportTemplateColumn[];
	rows: ReportTemplateRow[];
	hiddenColumnKeys?: string[];
	summaryRows?: ReportTemplateSummaryRow[];
	emptyText?: React.ReactNode;
	showSections?: ReportSectionVisibility;
	timestampText?: React.ReactNode;
	footerText?: React.ReactNode;
	className?: string;
}

function getColumnMeta(columnDef: ColumnDef<ReportTemplateRow, React.ReactNode>): ReportTemplateColumnMeta {
	return (columnDef.meta as ReportTemplateColumnMeta | undefined) ?? {};
}

export function ReportTemplateTable({
	title,
	subtitle,
	headerContent,
	metaColumns = [],
	columns,
	rows,
	hiddenColumnKeys = [],
	summaryRows = [],
	emptyText = "No Data",
	showSections,
	timestampText,
	footerText,
	className,
}: ReportTemplateTableProps) {
	const columnVisibility = Object.fromEntries(hiddenColumnKeys.map((key) => [key, false]));
	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			columnVisibility,
		},
		getRowId: (row) => row.key,
	});
	const visibleColumns = table.getVisibleLeafColumns();
	const tableColSpan = Math.max(visibleColumns.length, 1);

	return (
		<div
			className={cn(
				"flex flex-col gap-6 rounded-md border bg-white p-6 print:gap-4 print:rounded-none print:border-0 print:p-0",
				className,
			)}
		>
			{showSections?.header !== false &&
				(headerContent || (
					<div className="flex flex-col items-center gap-1 text-center print:gap-1">
						{/* Screen View */}
						<div className="text-lg font-bold text-slate-700 print:hidden">{title}</div>
						{subtitle && <div className="text-base font-semibold text-slate-600 print:hidden">{subtitle}</div>}

						{/* Print View */}
						<div className="hidden print:block print:text-[11px] print:font-normal print:text-black">
							Rabbit - {title}
						</div>
						<div className="hidden print:block print:text-[22px] print:font-bold print:text-black pb-0">
							ហាងចក្រទឹកកក លឹម ច័ន្ទ II
						</div>
						<div className="hidden pb-2 print:block print:pb-3 print:text-[13px] print:font-semibold print:text-black underline">
							TEL: 070669898
						</div>
					</div>
				))}

			{metaColumns.length > 0 && (
				<div className="mb-4 grid grid-cols-1 gap-4 text-xs text-slate-500 md:grid-cols-3 print:text-[13px] print:font-bold print:text-black print:mb-2 print:ml-1">
					{metaColumns.map((column) => {
						const align = column.align ?? "left";
						return (
							<div key={column.key} className={cn("flex flex-col gap-1", alignClass[align], column.className)}>
								{column.rows.map((row) => (
									<span key={`${column.key}:${String(row)}`}>{row}</span>
								))}
							</div>
						);
					})}
				</div>
			)}

			<div className="w-full overflow-x-auto">
				<table className="w-full border-collapse border print:border-black text-xs text-slate-700 print:text-[11px] print:text-black">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr
								key={headerGroup.id}
								className="bg-slate-50 text-slate-600 uppercase print:bg-transparent print:text-black"
							>
								{headerGroup.headers.map((header) => {
									const meta = getColumnMeta(header.column.columnDef);
									return (
										<th
											key={header.id}
											className={cn(
												"border print:border-black p-2.5 font-semibold print:px-2 print:py-1.5 print:font-bold",
												alignClass[meta?.align ?? "center"],
												meta?.headerClassName,
											)}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</th>
									);
								})}
							</tr>
						))}
					</thead>

					<tbody>
						{rows.length === 0 ? (
							<tr className="text-slate-400">
								<td colSpan={tableColSpan} className="p-10 text-center">
									{emptyText}
								</td>
							</tr>
						) : (
							table.getRowModel().rows.map((row) => (
								<tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										const meta = getColumnMeta(cell.column.columnDef);
										return (
											<td
												key={cell.id}
												className={cn(
													"border print:border-black p-2.5 print:px-2 print:py-1.5",
													alignClass[meta?.align ?? "center"],
													meta?.className,
												)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										);
									})}
								</tr>
							))
						)}
					</tbody>

					{/* Print-only Table Footer for Summary Rows */}
					{summaryRows.length > 0 && (
						<tfoot className="hidden print:table-footer-group">
							{summaryRows.map((summaryRow) => (
								<tr key={summaryRow.key} className="print:text-black">
									<td
										colSpan={tableColSpan - 1}
										className="border print:border-black print:px-2 print:py-2 text-right print:font-bold print:text-[12px] uppercase whitespace-nowrap"
									>
										{summaryRow.label}
									</td>
									<td className="border print:border-black print:px-2 print:py-2 text-right print:font-bold print:text-[12px] whitespace-nowrap">
										{summaryRow.value}
									</td>
								</tr>
							))}
						</tfoot>
					)}
				</table>
			</div>

			{/* Screen-only Summary Rows */}
			{summaryRows.length > 0 && (
				<div className="ml-auto mt-4 flex flex-col items-end gap-1 text-sm font-semibold text-slate-700 print:hidden">
					{summaryRows.map((summaryRow) => (
						<div key={summaryRow.key}>
							<span className="mr-2 uppercase">{summaryRow.label}</span>
							<span>{summaryRow.value}</span>
						</div>
					))}
				</div>
			)}

			<div className="flex justify-between text-[10px] text-slate-400 print:mt-3 print:text-[11px] print:text-black">
				<div className="flex flex-col gap-1">
					{showSections?.signature && <span>Signature: ________________</span>}
					{showSections?.timestamp !== false && timestampText && <span>{timestampText}</span>}
				</div>
				{showSections?.footer !== false && footerText && <span>{footerText}</span>}
			</div>
		</div>
	);
}
