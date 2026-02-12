import type { EquipmentItem, EquipmentItemId } from "@/core/types/equipment";
import { Button } from "@/core/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/ui/card";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";

interface StockOutBorrowFormProps {
	items: EquipmentItem[];
	itemId: EquipmentItemId;
	quantity: string;
	customerName: string;
	onItemChange: (value: EquipmentItemId) => void;
	onQuantityChange: (value: string) => void;
	onCustomerNameChange: (value: string) => void;
	onSubmit: () => void;
}

export function StockOutBorrowForm({
	items,
	itemId,
	quantity,
	customerName,
	onItemChange,
	onQuantityChange,
	onCustomerNameChange,
	onSubmit,
}: StockOutBorrowFormProps) {
	return (
		<Card className="xl:col-span-1">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">Stock Out (Borrow)</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-1.5">
					<Label>Customer</Label>
					<Input
						value={customerName}
						onChange={(e) => onCustomerNameChange(e.target.value)}
						placeholder="Customer name"
					/>
				</div>
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
				<Button className="w-full" onClick={onSubmit}>
					Save Borrow & Print Slip
				</Button>
			</CardContent>
		</Card>
	);
}
