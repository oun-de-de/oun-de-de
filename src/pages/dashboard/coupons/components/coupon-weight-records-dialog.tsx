import type { Coupon, WeightRecord } from "@/core/types/coupon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/core/ui/dialog";
import { formatDisplayDateTime, formatNumber } from "@/core/utils/formatters";

type CouponWeightRecordsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	coupon: Coupon | null;
	weightRecords: WeightRecord[];
	isLoading: boolean;
};

export function CouponWeightRecordsDialog({
	open,
	onOpenChange,
	coupon,
	weightRecords,
	isLoading,
}: CouponWeightRecordsDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
				<DialogHeader className="pr-8">
					<DialogTitle>Coupon Weight Records</DialogTitle>
					<DialogDescription>
						{coupon
							? `Coupon #${coupon.couponNo ?? "-"} • ${coupon.vehicle?.licensePlate ?? "No plate"}`
							: "Weight records"}
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<div className="py-8 text-center text-sm text-muted-foreground">Loading weight records...</div>
				) : weightRecords.length === 0 ? (
					<div className="py-8 text-center text-sm text-muted-foreground">No weight records found for this coupon.</div>
				) : (
					<div className="overflow-x-auto rounded border">
						<table className="min-w-full text-sm">
							<thead className="bg-muted/40">
								<tr>
									<th className="px-3 py-2 text-left font-medium">Product</th>
									<th className="px-3 py-2 text-right font-medium">Qty</th>
									<th className="px-3 py-2 text-right font-medium">Weight</th>
									<th className="px-3 py-2 text-right font-medium">Price</th>
									<th className="px-3 py-2 text-right font-medium">Amount</th>
									<th className="px-3 py-2 text-left font-medium">Out Time</th>
									<th className="px-3 py-2 text-left font-medium">Memo</th>
								</tr>
							</thead>
							<tbody>
								{weightRecords.map((record, index) => (
									<tr key={record.id ?? `${record.outTime}-${index}`} className="border-t align-top">
										<td className="px-3 py-2">{record.productName || "-"}</td>
										<td className="px-3 py-2 text-right">{formatNumber(record.quantity, "-")}</td>
										<td className="px-3 py-2 text-right">
											{record.weight == null ? "-" : `${formatNumber(record.weight)} kg`}
										</td>
										<td className="px-3 py-2 text-right">{formatNumber(record.pricePerProduct, "-")}</td>
										<td className="px-3 py-2 text-right">{formatNumber(record.amount, "-")}</td>
										<td className="px-3 py-2">{formatDisplayDateTime(record.outTime)}</td>
										<td className="px-3 py-2">{record.memo || "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
