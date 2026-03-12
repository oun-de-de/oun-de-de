import type { Customer } from "@/core/types/customer";
import type { ReportTemplateRow } from "../../../components/layout/report-template-table";
import { createIndexedReportRow } from "./report-row-helpers";

export function buildCustomerListRows(customers: Customer[]): ReportTemplateRow[] {
	return customers.map((customer, index) =>
		createIndexedReportRow(customer.id, index, {
			name: customer.name ?? "-",
			code: customer.code ?? "-",
			phone: customer.telephone ?? "-",
			geography: customer.geography ?? "-",
			address: customer.address ?? "-",
		}),
	);
}
