import type { EquipmentItem, EquipmentItemId } from "@/core/types/equipment";
import { Button } from "@/core/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";

interface StockInFormProps {
	items: EquipmentItem[];
	itemId: EquipmentItemId;
	quantity: string;
	note: string;
	onItemChange: (value: EquipmentItemId) => void;
	onQuantityChange: (value: string) => void;
	onNoteChange: (value: string) => void;
	onSubmit: () => void;
}

export function StockInForm({
	items,
	itemId,
	quantity,
	note,
	onItemChange,
	onQuantityChange,
	onNoteChange,
	onSubmit,
}: StockInFormProps) {
	return (
		<Card className="xl:col-span-1">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Stock In (Manual)</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-1.5">
					<Label>Item</Label>
					<Select value={itemId} onValueChange={(value) => onItemChange(value as EquipmentItemId)}>
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
				<div className="space-y-1.5">
					<Label>Quantity</Label>
					<Input type="number" min={1} value={quantity} onChange={(e) => onQuantityChange(e.target.value)} />
				</div>
				<div className="space-y-1.5">
					<Label>Note</Label>
					<Input value={note} onChange={(e) => onNoteChange(e.target.value)} placeholder="Manual stock in" />
				</div>
				<Button className="w-full" onClick={onSubmit}>
					Add Stock In
				</Button>
			</CardContent>
		</Card>
	);
}
