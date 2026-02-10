import type { InvoiceDraftForm } from "@/core/types/invoice";

type CreateInvoiceFormProps = {
	value: InvoiceDraftForm;
	onChange: (next: InvoiceDraftForm) => void;
};

export function CreateInvoiceForm({ value, onChange }: CreateInvoiceFormProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			<label className="flex flex-col gap-1 text-sm">
				<span className="text-gray-600">Invoice Date</span>
				<input
					type="date"
					value={value.invoiceDate}
					onChange={(e) => onChange({ ...value, invoiceDate: e.target.value })}
					className="h-9 rounded border border-gray-300 px-3"
				/>
			</label>
			<label className="flex flex-col gap-1 text-sm">
				<span className="text-gray-600">Due Date</span>
				<input
					type="date"
					value={value.dueDate}
					onChange={(e) => onChange({ ...value, dueDate: e.target.value })}
					className="h-9 rounded border border-gray-300 px-3"
				/>
			</label>
			<label className="md:col-span-2 flex flex-col gap-1 text-sm">
				<span className="text-gray-600">Memo</span>
				<textarea
					value={value.memo}
					onChange={(e) => onChange({ ...value, memo: e.target.value })}
					rows={3}
					className="rounded border border-gray-300 p-2"
				/>
			</label>
		</div>
	);
}
