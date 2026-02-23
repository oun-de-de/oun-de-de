import Icon from "@/core/components/icon/icon";
import type { InventoryItem } from "@/core/types/inventory";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";
import { Text } from "@/core/ui/typography";

type StockInFormProps = {
	items: InventoryItem[];
	itemId: string;
	quantity: string;
	note: string;
	reason: string;
	onItemChange: (value: string) => void;
	onQuantityChange: (value: string) => void;
	onNoteChange: (value: string) => void;
	onReasonChange: (value: string) => void;
	onSubmit: () => void;
	hideItemSelector?: boolean;
	isPending?: boolean;
};

export function StockInForm({
	items,
	itemId,
	quantity,
	note,
	reason,
	onItemChange,
	onQuantityChange,
	onNoteChange,
	onReasonChange,
	onSubmit,
	hideItemSelector = false,
	isPending = false,
}: StockInFormProps) {
	return (
		<div className="rounded-lg border border-green-200 bg-green-50/30 p-4 space-y-3">
			<div className="flex items-center gap-2 mb-1">
				<Icon icon="mdi:package-variant-plus" className="text-green-600" />
				<Text variant="body1" className="font-semibold text-green-900">
					Add Stock
				</Text>
			</div>
			{!hideItemSelector && (
				<div className="space-y-1.5">
					<Label>Item</Label>
					<Select value={itemId} onValueChange={onItemChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select item" />
						</SelectTrigger>
						<SelectContent>
							{items.map((item) => (
								<SelectItem key={item.id} value={item.id}>
									{item.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
			<div className="space-y-1.5">
				<Label>Quantity</Label>
				<Input type="number" min={1} value={quantity} onChange={(e) => onQuantityChange(e.target.value)} />
			</div>
			<div className="space-y-1.5">
				<Label>Reason</Label>
				<Input value={reason} onChange={(e) => onReasonChange(e.target.value)} placeholder="e.g. PURCHASE" />
			</div>
			<div className="space-y-1.5">
				<Label>Memo</Label>
				<Input value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder="Additional notes" />
			</div>
			<Button variant="success" className="w-full" onClick={onSubmit} disabled={isPending}>
				<Icon icon="mdi:plus" className="mr-1" />
				{isPending ? "Saving..." : "Add Stock"}
			</Button>
		</div>
	);
}
