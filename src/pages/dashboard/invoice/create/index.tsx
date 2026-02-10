import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import type { CreateInvoiceLocationState, InvoiceDraftForm, InvoiceSaveMode } from "@/core/types/invoice";
import { Button } from "@/core/ui/button";
import { INVOICE_ROWS } from "../constants";
import { CreateInvoiceForm } from "./components/create-invoice-form";
import { SelectedInvoiceItemsTable } from "./components/selected-invoice-items-table";

export default function CreateInvoicePage() {
	const navigate = useNavigate();
	const location = useLocation();
	const state = (location.state as CreateInvoiceLocationState | null) ?? null;
	const selectedInvoiceIds = state?.selectedInvoiceIds ?? [];
	const mode = state?.mode ?? "standard";

	const selectedRows = useMemo(
		() => INVOICE_ROWS.filter((row) => selectedInvoiceIds.includes(row.id)),
		[selectedInvoiceIds],
	);

	const [form, setForm] = useState<InvoiceDraftForm>({
		invoiceDate: new Date().toISOString().slice(0, 10),
		dueDate: new Date().toISOString().slice(0, 10),
		memo: "",
	});

	const handleSave = (nextMode: InvoiceSaveMode) => {
		if (selectedRows.length === 0) {
			toast.error("No selected items to create invoice");
			return;
		}

		const modeLabel = nextMode === "draft" ? "draft" : "invoice";
		const hasDate = Boolean(form.invoiceDate && form.dueDate);
		if (!hasDate) {
			toast.error("Invoice date and due date are required");
			return;
		}
		toast.success(`Created ${modeLabel} from ${selectedRows.length} selected item(s)`);
		navigate("/dashboard/invoice");
	};

	return (
		<div className="flex h-full flex-col gap-6 p-6">
			<div className="flex items-center justify-between gap-2">
				<h2 className="text-lg font-semibold text-sky-600">Create Invoice</h2>
				<Button
					type="button"
					onClick={() => navigate("/dashboard/invoice")}
					className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
				>
					Back
				</Button>
			</div>

			<div className="rounded border border-gray-200 p-4">
				<p className="text-sm text-gray-600">
					Mode: <span className="font-medium">{mode}</span>
				</p>
				<p className="text-sm text-gray-600">
					Selected items: <span className="font-medium">{selectedRows.length}</span>
				</p>
			</div>

			<CreateInvoiceForm value={form} onChange={setForm} />

			<SelectedInvoiceItemsTable rows={selectedRows} />

			<div className="flex items-center justify-end gap-2">
				<Button
					type="button"
					onClick={() => navigate("/dashboard/invoice")}
					className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
				>
					Cancel
				</Button>
				<Button
					type="button"
					onClick={() => handleSave("draft")}
					className="rounded border border-blue-400 px-4 py-2 text-sm text-blue-500 hover:bg-blue-50"
				>
					Save Draft
				</Button>
				<Button
					type="button"
					onClick={() => handleSave("final")}
					className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
				>
					Save Invoice
				</Button>
			</div>
		</div>
	);
}
