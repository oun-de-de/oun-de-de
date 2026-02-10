import type { SelectedInvoiceRow } from "@/core/types/invoice";

type SelectedInvoiceItemsTableProps = {
	rows: SelectedInvoiceRow[];
};

export function SelectedInvoiceItemsTable({ rows }: SelectedInvoiceItemsTableProps) {
	return (
		<div className="rounded border border-gray-200">
			<div className="border-b border-gray-200 px-4 py-2 text-sm font-medium">Selected Items</div>
			<div className="max-h-72 overflow-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-100 text-left text-gray-600">
							<th className="px-4 py-2">Invoice No</th>
							<th className="px-4 py-2">Customer</th>
							<th className="px-4 py-2 text-right">Balance</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.id} className="border-b border-gray-100 last:border-b-0">
								<td className="px-4 py-2 text-sky-600">{row.refNo}</td>
								<td className="px-4 py-2">{row.customer}</td>
								<td className="px-4 py-2 text-right">{row.balance.toLocaleString()}</td>
							</tr>
						))}
						{rows.length === 0 && (
							<tr>
								<td className="px-4 py-4 text-center text-gray-500" colSpan={3}>
									No selected items
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
