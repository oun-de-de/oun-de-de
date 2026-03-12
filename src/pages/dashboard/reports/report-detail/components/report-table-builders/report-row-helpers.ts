import type { ReportTemplateRow } from "../../../components/layout/report-template-table";

type ReportCellValue = ReportTemplateRow["cells"][string];
type ReportRowCells = Record<string, ReportCellValue>;

interface LedgerCellParams {
	no?: ReportCellValue;
	date: ReportCellValue;
	refNo: ReportCellValue;
	type: ReportCellValue;
	name: ReportCellValue;
	memo: ReportCellValue;
	debit: ReportCellValue;
	credit: ReportCellValue;
	balance: ReportCellValue;
	extraCells?: ReportRowCells;
}

export function createReportRow(key: string, cells: ReportRowCells): ReportTemplateRow {
	return { key, cells };
}

export function createIndexedReportRow(key: string, index: number, cells: ReportRowCells): ReportTemplateRow {
	return createReportRow(key, { no: index + 1, ...cells });
}

export function createLedgerCells({
	no,
	date,
	refNo,
	type,
	name,
	memo,
	debit,
	credit,
	balance,
	extraCells = {},
}: LedgerCellParams): ReportRowCells {
	return {
		...(no == null ? {} : { no }),
		date,
		refNo,
		type,
		name,
		memo,
		debit,
		credit,
		balance,
		...extraCells,
	};
}
