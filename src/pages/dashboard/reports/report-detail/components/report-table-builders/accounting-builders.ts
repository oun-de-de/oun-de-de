import { accountingRows } from "@/_mock/data/dashboard";
import { formatNumber } from "@/core/utils/formatters";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";
import { parseNumericCell } from "../report-table-utils";

export function buildLedgerRows(): ReportTemplateRow[] {
	let runningBalance = 0;

	return accountingRows.map((row, index) => {
		const debit = parseNumericCell(row.dr);
		const credit = parseNumericCell(row.cr);
		runningBalance += debit - credit;

		return {
			key: `${row.refNo}-${index}`,
			cells: {
				date: row.date,
				type: row.type,
				refNo: row.refNo,
				employee: "General Employee",
				memo: row.memo || row.currency || "-",
				class: row.currency || "General",
				name: row.type,
				product: "-",
				debit: row.dr || "-",
				credit: row.cr || "-",
				balance: formatNumber(runningBalance),
			},
		};
	});
}

export function buildTrialBalanceRows(): ReportTemplateRow[] {
	const aggregates = accountingRows.reduce<Record<string, { debit: number; credit: number }>>((acc, row) => {
		const key = row.type;
		acc[key] = acc[key] ?? { debit: 0, credit: 0 };
		acc[key].debit += parseNumericCell(row.dr);
		acc[key].credit += parseNumericCell(row.cr);
		return acc;
	}, {});

	return Object.entries(aggregates).map(([account, totals], index) => ({
		key: `trial-${account}`,
		cells: {
			no: index + 1,
			account,
			debit: formatNumber(totals.debit),
			credit: formatNumber(totals.credit),
		},
	}));
}
