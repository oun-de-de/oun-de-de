import Icon from "@/core/components/icon/icon";
import type { Customer } from "@/core/types/customer";
import type { InventoryItem } from "@/core/types/inventory";
import { Button } from "@/core/ui/button";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/ui/select";
import { Text } from "@/core/ui/typography";

type StockOutBorrowFormProps = {
	items: InventoryItem[];
	customers: Customer[];
	itemId: string;
	quantity: string;
	customerId: string;
	expectedReturnDate: string;
	memo: string;
	onItemChange: (value: string) => void;
	onQuantityChange: (value: string) => void;
	onCustomerIdChange: (value: string) => void;
	onExpectedReturnDateChange: (value: string) => void;
	onMemoChange: (value: string) => void;
	onSubmit: () => void;
	hideItemSelector?: boolean;
	isPending?: boolean;
};

export function StockOutBorrowForm({
	items,
	customers,
	itemId,
	quantity,
	customerId,
	expectedReturnDate,
	memo,
	onItemChange,
	onQuantityChange,
	onCustomerIdChange,
	onExpectedReturnDateChange,
	onMemoChange,
	onSubmit,
	hideItemSelector = false,
	isPending = false,
}: StockOutBorrowFormProps) {
	return (
		<div className="rounded-lg border border-orange-200 bg-orange-50/30 p-4 space-y-3">
			<div className="flex items-center gap-2 mb-1">
				<Icon icon="mdi:package-variant-minus" className="text-orange-600" />
				<Text variant="body1" className="font-semibold text-orange-900">
					Borrow Stock
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
				<Label>Customer</Label>
				<Select value={customerId} onValueChange={onCustomerIdChange}>
					<SelectTrigger>
						<SelectValue placeholder="Select customer" />
					</SelectTrigger>
					<SelectContent>
						{customers.map((customer) => (
							<SelectItem key={customer.id} value={customer.id}>
								{customer.name}
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
				<Label>Expected Return Date</Label>
				<Input type="date" value={expectedReturnDate} onChange={(e) => onExpectedReturnDateChange(e.target.value)} />
			</div>
			<div className="space-y-1.5">
				<Label>Memo</Label>
				<Input value={memo} onChange={(e) => onMemoChange(e.target.value)} placeholder="Additional notes" />
			</div>
			<Button variant="warning" className="w-full" onClick={onSubmit} disabled={isPending}>
				<Icon icon="mdi:minus" className="mr-1" />
				{isPending ? "Saving..." : "Borrow Stock"}
			</Button>
		</div>
	);
}
