import { useState } from "react";
import { Button } from "@/core/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/core/ui/dialog";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";
import { INVOICE_TYPE_OPTIONS } from "../constants/constants";

interface InvoiceBatchUpdateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdate: (data: { customerName: string; type: string; status: string }) => void;
	isUpdating?: boolean;
	selectedCount: number;
}

export function InvoiceBatchUpdateDialog({
	open,
	onOpenChange,
	onUpdate,
	isUpdating,
	selectedCount,
}: InvoiceBatchUpdateDialogProps) {
	const [customerName, setCustomerName] = useState("");
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");

	const handleUpdate = () => {
		onUpdate({ customerName, type, status });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update {selectedCount} Invoice(s)</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="customerName" className="text-right">
							Customer
						</Label>
						<Input
							id="customerName"
							value={customerName}
							onChange={(e) => setCustomerName(e.target.value)}
							className="col-span-3"
							placeholder="Leave empty to keep current"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="type" className="text-right">
							Type
						</Label>
						<Select value={type} onValueChange={setType}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value=" ">Keep current</SelectItem>
								{INVOICE_TYPE_OPTIONS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="status" className="text-right">
							Status
						</Label>
						<Select value={status} onValueChange={setStatus}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value=" ">Keep current</SelectItem>
								<SelectItem value="OPEN">Open</SelectItem>
								<SelectItem value="CLOSED">Closed</SelectItem>
								<SelectItem value="OVERDUE">Overdue</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
						Cancel
					</Button>
					<Button onClick={handleUpdate} disabled={isUpdating}>
						{isUpdating ? "Updating..." : "Update"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
