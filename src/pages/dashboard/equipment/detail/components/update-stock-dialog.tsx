import type { InventoryItem } from "@/core/types/inventory";
import { Button } from "@/core/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/core/ui/dialog";
import { Input } from "@/core/ui/input";
import { Label } from "@/core/ui/label";
import { Switch } from "@/core/ui/switch";

type UpdateStockDialogProps = {
	item: InventoryItem;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	quantity: string;
	reason: string;
	memo: string;
	onQuantityChange: (value: string) => void;
	onReasonChange: (value: string) => void;
	onMemoChange: (value: string) => void;
	onSubmit: () => void;
	isPending?: boolean;
};

export function UpdateStockDialog({
	item,
	open,
	onOpenChange,
	quantity,
	reason,
	memo,
	onQuantityChange,
	onReasonChange,
	onMemoChange,
	onSubmit,
	isPending = false,
}: UpdateStockDialogProps) {
	const isStockIn = reason === "purchase";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-1">
					Update Stock
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Stock</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-2">
					<div className="space-y-1.5">
						<Label>Item</Label>
						<Input value={`${item.name} (${item.code})`} disabled />
					</div>
					<div className="space-y-1.5">
						<Label>Reason</Label>
						<div className="flex items-center justify-between rounded-md border p-3">
							<div className="space-y-0.5">
								<div className="font-semibold">
									<span className="text-sm">{isStockIn ? "Purchase" : "Consume"}</span>
								</div>
								<div className="text-xs text-slate-500">
									{isStockIn ? "Switch is ON, reason will be purchase." : "Switch is OFF, reason will be consume."}
								</div>
							</div>
							<div className="flex items-center gap-2 text-xs text-slate-500">
								<Switch
									checked={isStockIn}
									onCheckedChange={(checked) => onReasonChange(checked ? "purchase" : "consume")}
								/>
							</div>
						</div>
					</div>
					<div className="space-y-1.5">
						<Label>Quantity</Label>
						<Input type="number" min={1} value={quantity} onChange={(e) => onQuantityChange(e.target.value)} />
					</div>
					<div className="space-y-1.5">
						<Label>Description</Label>
						<Input
							value={memo}
							onChange={(e) => onMemoChange(e.target.value)}
							placeholder="Describe this stock update"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? "Saving..." : "Update Stock"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
