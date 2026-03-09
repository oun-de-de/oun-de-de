import type { ReportTemplateColumn } from "../../components/layout/report-template-table";
import { buildSizedColumns } from "../report-column-helpers";

export function buildCustomerLoanColumns(): ReportTemplateColumn[] {
	return buildSizedColumns([
		["no", "NO.", "w-[6%]", "center"],
		["date", "DATE", "w-[11%]", "center"],
		["code", "CUSTOMER CODE", "w-[12%]", "center"],
		["name", "CUSTOMERS' NAME", "w-[16%]"],
		["reason", "REASON", "w-[12%]"],
		["debit", "DEBIT", "w-[13%]", "right"],
		["credit", "CREDIT", "w-[13%]", "right"],
		["balance", "BALANCE", "w-[13%]", "right"],
		["qty", "QTY", "w-[7%]", "right"],
		["paymentTerm", "PAYMENT TERM", "w-[12%]"],
		["other", "OTHER", "w-[10%]"],
	]);
}

export function buildEmployeeLoanColumns(): ReportTemplateColumn[] {
	return buildSizedColumns([
		["date", "DATE", "w-[12%]", "center"],
		["type", "TYPE", "w-[12%]", "center"],
		["refNo", "REF NO", "w-[14%]"],
		["employee", "EMPLOYEE", "w-[18%]"],
		["memo", "MEMO", "w-[15%]"],
		["name", "NAME", "w-[12%]"],
		["debit", "DEBIT", "w-[13%]", "right"],
		["credit", "CREDIT", "w-[13%]", "right"],
		["balance", "BALANCE", "w-[13%]", "right"],
	]);
}
